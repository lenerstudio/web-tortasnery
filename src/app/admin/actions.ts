"use server"

import { query } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { sendOrderEmail } from "@/app/actions"
//import { writeFile, mkdir } from 'fs/promises'
//import path from 'path'

//############ VERCEL BLOB ############
import { put } from '@vercel/blob';

import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

const JWT_SECRET_STR = process.env.JWT_SECRET || "tortasnery_super_secret_key_123456789";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STR);

// --- Database Setup ---

export async function checkDatabaseConnection() {
    try {
        await query('SELECT 1')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Error de conexión con la base de datos" }
    }
}

export async function setupDatabase() {
    try {
        // Run Schema Creation Queries
        // Not atomic but robust enough for this MVP

        // 1. Users
        await query(`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'admin',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )`)

        // Create default admin if none exists
        const adminExists: any = await query('SELECT * FROM users WHERE email = ?', ['admin@tortasnery.com'])
        if (adminExists.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10)
            await query('INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
                ['Administrador', 'admin@tortasnery.com', hashedPassword, 'admin'])
            console.log("Default admin created: admin@tortasnery.com / admin123")
        }

        // 2. Categories
        await query(`CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            slug VARCHAR(100) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`)

        // 3. Products
        await query(`CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            category_id INT,
            stock INT NOT NULL DEFAULT 0,
            image_url LONGTEXT,
            slug VARCHAR(255) UNIQUE,
            is_active BOOLEAN DEFAULT TRUE,
            is_featured BOOLEAN DEFAULT FALSE,
            rating DECIMAL(2, 1) DEFAULT 5.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        )`)

        // Add is_featured column if it doesn't exist (migration)
        try {
            await query(`ALTER TABLE products ADD COLUMN is_featured BOOLEAN DEFAULT FALSE`)
        } catch (e) {
            // Column probably exists, skip
        }

        // Add slug column if it doesn't exist (migration)
        try {
            // first check if column exists to accurate logging/logic, but simple ALTER IGNORE or catch is fine.
            // Removing UNIQUE constraint here to ensure it can be added even if table has data (though NULLs usually fine)
            // But just to be safe and ensure migration passes.
            await query(`ALTER TABLE products ADD COLUMN slug VARCHAR(255)`)
        } catch (e) {
            // Maybe column exists, ignore
        }

        // Backfill slugs
        try {
            // Fetch all products to check/fix slugs (not just nulls, to ensure format)
            // Actually, only fix nulls or empty to avoid changing existing valid slugs
            // Fetch all products to ensure everyone has a slug
            const allProducts: any[] = await query('SELECT id, name, slug FROM products')
            for (const p of allProducts) {
                // If slug is missing, empty, or numeric (ID based), generate a proper slug
                if (!p.slug || p.slug === "" || !isNaN(Number(p.slug))) {
                    let slug = p.name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '') || `product-${p.id}`

                    try {
                        await query('UPDATE products SET slug = ? WHERE id = ?', [slug, p.id])
                    } catch (e) {
                        // If duplicate, append ID
                        const newSlug = `${slug}-${p.id}`
                        try {
                            await query('UPDATE products SET slug = ? WHERE id = ?', [newSlug, p.id])
                        } catch (ignore) { }
                    }
                }
            }
            revalidatePath('/')
            revalidatePath('/productos')
        } catch (e) {
            console.log("Backfill slugs error", e)
        }

        // 4. Orders
        await query(`CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_number VARCHAR(20) NOT NULL UNIQUE,
            customer_id INT,
            customer_name VARCHAR(255) NOT NULL,
            customer_email VARCHAR(255) NOT NULL,
            customer_phone VARCHAR(50) NOT NULL,
            
            event_date DATE NOT NULL,
            event_time TIME NOT NULL,
            delivery_address TEXT NOT NULL,
            notes TEXT,

            total_amount DECIMAL(10, 2) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            payment_method VARCHAR(50) DEFAULT 'whatsapp',
            
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL
        )`)

        // 5. Order Items
        await query(`CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            product_id INT,
            product_name VARCHAR(255) NOT NULL,
            quantity INT NOT NULL,
            unit_price DECIMAL(10, 2) NOT NULL,
            subtotal DECIMAL(10, 2) NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
        )`)

        // NEW: Store Settings Table
        await query(`CREATE TABLE IF NOT EXISTS store_settings (
            id INT PRIMARY KEY,
            store_name VARCHAR(255),
            contact_email VARCHAR(255),
            contact_phone VARCHAR(50),
            address TEXT,
            logo LONGTEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`)

        // Start Migration: Add logo column
        try {
            await query("ALTER TABLE store_settings ADD COLUMN logo LONGTEXT")
        } catch (e) { }
        // End Migration

        // 6. Seeds (Check if exists first)
        const cats = await query<any[]>('SELECT count(*) as count FROM categories')
        if (cats[0].count === 0) {
            await query("INSERT INTO categories (name, slug) VALUES ('Bodas', 'bodas'), ('XV Años', 'xv-anos'), ('Especiales', 'especiales')")
            // Insert Sample Products
            await query("INSERT INTO products (name, description, price, category_id, stock, image_url, rating) VALUES ('Wedding Classic', '3 pisos de elegancia pura.', 85.00, 1, 10, '/img/maqueta-matrimonio-1.jpg', 5.0), ('Floral Vintage XV', 'Tonos pastel.', 65.00, 2, 8, '/img/maqueta-matrimonio-2.jpg', 5.0)")
        }

        // Initialize Settings if empty
        const settings = await query<any[]>('SELECT count(*) as count FROM store_settings')
        if (settings[0].count === 0) {
            await query(`INSERT INTO store_settings (id, store_name, contact_email, contact_phone, address) VALUES (1, 'Tortas Nery', 'admin@tortasnery.com', '+51 997 935 991', 'Av. Ejemplo 123, Lima')`)
        }

        return { success: true }
    } catch (error) {
        console.error("Setup DB Error:", error)
        return { success: false, error: "Failed to setup database" }
    }
}

// --- Store Settings ---

export async function getStoreSettings() {
    try {
        const res: any[] = await query('SELECT * FROM store_settings WHERE id = 1')
        if (res.length > 0) return { success: true, data: res[0] }
        return { success: true, data: {} }
    } catch (error) {
        return { success: false, error: "Failed to fetch settings" }
    }
}

export async function updateStoreSettings(formData: FormData) {
    const store_name = formData.get("store_name") as string
    const contact_email = formData.get("contact_email") as string
    const contact_phone = formData.get("contact_phone") as string
    const address = formData.get("address") as string
    const logoFile = formData.get("logo") as File | null

    let logoUrl = null
    if (logoFile && logoFile.size > 0) {
        try {
            const filename = `uploads/logo-${Date.now()}-${logoFile.name.replaceAll(' ', '_')}`
            const blob = await put(filename, logoFile, { access: 'public' })
            logoUrl = blob.url
        } catch (error) {
            console.error("Vercel Blob upload failed (check token), falling back to Base64 DB storage.", error)
            const bytes = await logoFile.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const mimeType = logoFile.type || 'image/jpeg'
            const base64 = buffer.toString('base64')
            logoUrl = `data:${mimeType};base64,${base64}`
        }
    }

    try {
        if (logoUrl) {
            await query(`INSERT INTO store_settings (id, store_name, contact_email, contact_phone, address, logo) 
                VALUES (1, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE store_name = ?, contact_email = ?, contact_phone = ?, address = ?, logo = ?`,
                [store_name, contact_email, contact_phone, address, logoUrl, store_name, contact_email, contact_phone, address, logoUrl])
        } else {
            await query(`INSERT INTO store_settings (id, store_name, contact_email, contact_phone, address) 
                VALUES (1, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE store_name = ?, contact_email = ?, contact_phone = ?, address = ?`,
                [store_name, contact_email, contact_phone, address, store_name, contact_email, contact_phone, address])
        }

        revalidatePath('/admin/configuracion')
        revalidatePath('/') // Update Landing Page
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to update settings" }
    }
}

export async function seedMockData() {
    try {
        // Generate random orders
        const names = ["Carlos", "Maria", "Juan", "Ana", "Luis", "Elena", "Pedro", "Lucia"]
        const statuses = ["pending", "processing", "completed", "cancelled"]

        for (let i = 0; i < 10; i++) {
            const name = names[Math.floor(Math.random() * names.length)]
            const status = statuses[Math.floor(Math.random() * statuses.length)]
            const total = Math.floor(Math.random() * 500) + 50
            const date = new Date()
            date.setDate(date.getDate() - Math.floor(Math.random() * 30)) // Random date in last 30 days

            await query(`INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, event_date, event_time, delivery_address, notes, total_amount, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    Math.floor(Math.random() * 900000) + 100000,
                    `${name} Test`,
                    `${name.toLowerCase()}@example.com`,
                    "999888777",
                    date.toISOString().split('T')[0],
                    "14:00",
                    "Calle Falsa 123",
                    "Mock Order",
                    total,
                    status,
                    date
                ])
        }

        revalidatePath('/admin')
        revalidatePath('/admin/pedidos')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: "Failed to seed data" }
    }
}

// --- Categories ---

export async function getCategories() {
    try {
        const categories = await query('SELECT * FROM categories ORDER BY name ASC')
        return { success: true, data: categories }
    } catch (error) {
        console.error("Error fetching categories:", error)
        return { success: false, error: "Failed to fetch categories" }
    }
}

export async function createCategory(formData: FormData) {
    const name = formData.get("name") as string
    const slug = (formData.get("slug") as string)?.toLowerCase() || name.toLowerCase().replace(/ /g, '-')

    try {
        await query('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug])
        revalidatePath('/admin/categorias')
        revalidatePath('/productos')
        return { success: true }
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, error: "La categoría o el slug ya existen" }
        }
        return { success: false, error: "Error al crear la categoría" }
    }
}

export async function updateCategory(id: number, formData: FormData) {
    const name = formData.get("name") as string
    const slug = (formData.get("slug") as string)?.toLowerCase() || name.toLowerCase().replace(/ /g, '-')

    try {
        await query('UPDATE categories SET name = ?, slug = ? WHERE id = ?', [name, slug, id])
        revalidatePath('/admin/categorias')
        revalidatePath('/productos')
        return { success: true }
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, error: "La categoría o el slug ya existen" }
        }
        return { success: false, error: "Error al actualizar la categoría" }
    }
}

export async function deleteCategory(id: number) {
    try {
        // Check if there are products in this category
        const products: any[] = await query('SELECT id FROM products WHERE category_id = ? LIMIT 1', [id])
        if (products.length > 0) {
            return { success: false, error: "No se puede eliminar una categoría que tiene productos asociados" }
        }

        await query('DELETE FROM categories WHERE id = ?', [id])
        revalidatePath('/admin/categorias')
        revalidatePath('/productos')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Error al eliminar la categoría" }
    }
}


export async function getProducts() {
    try {
        const products = await query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC')
        // Format for frontend if needed, currently DB returns snake_case, JS prefers camelCase but we can map or use as is.
        // Let's map to simpler objects
        return { success: true, data: products }
    } catch (error) {
        console.error("Error fetching products:", error)
        return { success: false, error: "Failed to fetch products" } // Return empty or error logic
    }
}

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const stock = parseInt(formData.get("stock") as string)
    const categoryName = formData.get("category") as string
    const imageFile = formData.get("image") as File

    let imageUrl = "/img/logo.jpg"

    try {
        {/* 
        if (imageFile && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
            await mkdir(uploadDir, { recursive: true })
            const filename = `${Date.now()}-${imageFile.name.replaceAll(' ', '_')}`
            const filepath = path.join(uploadDir, filename)
            await writeFile(filepath, buffer)
            imageUrl = `/uploads/products/${filename}`
        }
            */}

        // --- CAMBIO AQUÍ: LÓGICA DE VERCEL BLOB ---
        if (imageFile && imageFile.size > 0) {
            // Generamos un nombre único

            const filename = `/uploads/products/${Date.now()}-${imageFile.name.replaceAll(' ', '_')}`;

            // Subimos directamente a la nube de Vercel
            const blob = await put(filename, imageFile, {
                access: 'public',
            });

            // blob.url es la dirección https://... que guardaremos en la DB
            imageUrl = blob.url;
        }
        // --- FIN DEL CAMBIO ---

        // 1. Get Category ID
        let categoryId: number | null = null;
        if (categoryName) {
            // Check if it's an ID (numeric string)
            if (!isNaN(parseInt(categoryName)) && /^\d+$/.test(categoryName)) {
                categoryId = parseInt(categoryName)
            } else {
                // Check slug first
                let cats: any[] = await query('SELECT id FROM categories WHERE slug = ?', [categoryName.toLowerCase()])
                if (cats.length === 0) {
                    cats = await query('SELECT id FROM categories WHERE name = ?', [categoryName])
                }
                if (cats.length > 0) categoryId = cats[0].id
            }
        }

        let slug = name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        // Verify uniqueness is hard without query. Let's append timestamp to be safe or try/catch?
        // Since we want clean URLs, let's just use timestamp for NEW products to avoid collision, 
        // OR better: check if exists.
        // For MVP, appending timestamp is safest to avoid "Duplicate entry" error crashing the app.
        // User asked for "maqueta-premiun-blue".
        // Let's try exact match, if fails, user has to retry or we handle it?
        // Let's just append random suffix if we can't check.
        // Actually, we can check.
        const existingSlug: any[] = await query('SELECT id FROM products WHERE slug = ?', [slug])
        if (existingSlug.length > 0) {
            slug = `${slug}-${Date.now()}`
        }

        const sql = `INSERT INTO products (name, description, price, stock, category_id, image_url, slug) VALUES (?, ?, ?, ?, ?, ?, ?)`
        await query(sql, [name, description, price, stock, categoryId, imageUrl, slug])

        revalidatePath('/admin/productos')
        revalidatePath('/productos')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: "Failed to create product" }
    }
}
export async function importProducts(productsData: any[]) {
    try {
        for (const p of productsData) {
            // Basic validation
            if (!p.name || !p.price) continue

            // Get Category ID by name or slug
            let categoryId: number | null = null;
            if (p.category) {
                let cats: any[] = await query('SELECT id FROM categories WHERE name = ? OR slug = ?', [p.category, p.category.toLowerCase()])
                if (cats.length > 0) categoryId = cats[0].id
            }

            let slug = p.name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            // For import, we might have many. Let's append random if needed.
            // But checking each is slow. Let's just append random to be safe for bulk import?
            // Or try/catch? 
            // Let's append a short random string to ensure uniqueness for bulk import unless we want perfect slugs.
            // p.slug could be provided in excel? If not, generate.
            // Attempt clean slug. If duplicate, DB error? Import should be robust.
            // Let's just append random to avoid errors.
            slug = `${slug}-${Math.floor(Math.random() * 10000)}`

            const sql = `INSERT INTO products (name, description, price, stock, category_id, image_url, slug) VALUES (?, ?, ?, ?, ?, ?, ?)`
            await query(sql, [
                p.name,
                p.description || "",
                parseFloat(p.price),
                parseInt(p.stock) || 0,
                categoryId,
                p.image_url || "/img/logo.jpg",
                slug
            ])
        }

        revalidatePath('/admin/productos')
        revalidatePath('/productos')
        return { success: true }
    } catch (error) {
        console.error("Import Error:", error)
        return { success: false, error: "Error al importar productos" }
    }
}
export async function getProductById(id: number) {
    try {
        const res: any[] = await query('SELECT * FROM products WHERE id = ?', [id])
        if (res.length > 0) return { success: true, data: res[0] }
        return { success: false, error: "Producto no encontrado" }
    } catch (error) {
        return { success: false, error: "Error al obtener el producto" }
    }
}

export async function getProductBySlug(slug: string) {
    try {
        // 1. Try ID lookup if it looks like an ID
        // This is prioritized to handle cases where slug column might be missing or backfill failed
        if (!isNaN(parseInt(slug))) {
            try {
                const resId: any[] = await query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?', [parseInt(slug)])
                if (resId.length > 0) {
                    return { success: true, data: resId[0] }
                }
            } catch (idErr) {
                // Ignore ID lookup error
            }
        }

        // 2. Try Slug lookup
        const res: any[] = await query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ?', [slug])
        if (res.length > 0) {
            return { success: true, data: res[0] }
        }

        return { success: false, error: "Producto no encontrado" }
    } catch (error) {
        console.error("getProductBySlug Error:", error)
        return { success: false, error: "Error al obtener el producto" }
    }
}

export async function updateProduct(id: number, formData: FormData) {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const stock = parseInt(formData.get("stock") as string)
    const categoryName = formData.get("category") as string
    const imageFile = formData.get("image") as File
    const existingImageUrl = formData.get("imageUrl") as string

    let imageUrl = existingImageUrl || "/img/logo.jpg"

    try {
        /*
        if (imageFile && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
            await mkdir(uploadDir, { recursive: true })
            const filename = `${Date.now()}-${imageFile.name.replaceAll(' ', '_')}`
            const filepath = path.join(uploadDir, filename)
            await writeFile(filepath, buffer)
            imageUrl = `/uploads/products/${filename}`
        }*/

        // --- CAMBIO AQUÍ: LÓGICA DE VERCEL BLOB ---
        if (imageFile && imageFile.size > 0) {
            // Generamos un nombre único

            const filename = `/uploads/products/${Date.now()}-${imageFile.name.replaceAll(' ', '_')}`;

            // Subimos directamente a la nube de Vercel
            const blob = await put(filename, imageFile, {
                access: 'public',
            });

            // blob.url es la dirección https://... que guardaremos en la DB
            imageUrl = blob.url;
        }
        // --- FIN DEL CAMBIO ---

        let categoryId: number | null = null;
        if (categoryName) {
            if (!isNaN(parseInt(categoryName)) && /^\d+$/.test(categoryName)) {
                categoryId = parseInt(categoryName)
            } else {
                let cats: any[] = await query('SELECT id FROM categories WHERE slug = ? OR name = ?', [categoryName.toLowerCase(), categoryName])
                if (cats.length > 0) categoryId = cats[0].id
            }
        }

        // Update slug if name changes? For now, let's keep the slug stable or update it if we really want. 
        // User asked for "productos/[nombre-producto]", meaning slug should ideally reflect name.
        // But changing slug breaks old links. Let's just keep existing slug or update logic if needed. 
        // For simplicity, I won't auto-update slug on name change to avoid broken links, unless we add a specific slug field in edit form.
        // Since we don't have slug field in edit form (based on ProductsAdminPage), I'll leave it as is.
        // Or I can update it if it is empty (which shouldn't happen with migration).

        const sql = `UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image_url = ? WHERE id = ?`
        await query(sql, [name, description, price, stock, categoryId, imageUrl, id])

        revalidatePath('/admin/productos')
        revalidatePath('/productos')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: "Failed to update product" }
    }
}

export async function toggleFeaturedProduct(id: number, featured: boolean) {
    try {
        const isFeaturedNum = featured ? 1 : 0

        if (isFeaturedNum === 1) {
            // Check current featured count
            const count: any[] = await query('SELECT COUNT(*) as featuredCount FROM products WHERE is_featured = 1')
            if (count[0].featuredCount >= 6) {
                return { success: false, error: "Máximo 6 productos destacados permitidos" }
            }
        }

        await query('UPDATE products SET is_featured = ? WHERE id = ?', [isFeaturedNum, id])
        revalidatePath('/admin/productos')
        revalidatePath('/') // Revalidate homepage too
        return { success: true }
    } catch (error) {
        console.error("Toggle featured error:", error)
        return { success: false, error: "Error al cambiar estado destacado" }
    }
}

export async function getFeaturedProducts() {
    try {
        await setupDatabase() // Ensure migrations run
        const products = await query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_featured = TRUE ORDER BY p.updated_at DESC')
        return { success: true, data: products }
    } catch (error) {
        return { success: false, error: "Error al obtener productos destacados" }
    }
}

export async function deleteProduct(id: number) {
    try {
        await query('DELETE FROM products WHERE id = ?', [id])
        revalidatePath('/admin/productos')
        revalidatePath('/productos')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Error al eliminar" }
    }
}

// --- Orders ---

export async function getOrders() {
    try {
        const orders: any[] = await query('SELECT * FROM orders ORDER BY created_at DESC')
        const serialized = orders.map(o => ({
            ...o,
            total_amount: o.total_amount?.toString() || "0",
            created_at: o.created_at instanceof Date ? o.created_at.toISOString() : o.created_at,
            event_date: o.event_date instanceof Date ? o.event_date.toISOString() : o.event_date
        }))
        return { success: true, data: serialized }
    } catch (error) {
        console.error("getOrders Error:", error)
        return { success: false, error: "Error al obtener órdenes" }
    }
}

export async function getUserOrders(email: string) {
    try {
        const orders: any[] = await query('SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC', [email])
        const serialized = orders.map(o => ({
            ...o,
            total_amount: o.total_amount?.toString() || "0",
            created_at: o.created_at instanceof Date ? o.created_at.toISOString() : o.created_at,
            event_date: o.event_date instanceof Date ? o.event_date.toISOString() : o.event_date
        }))
        return { success: true, data: serialized }
    } catch (error) {
        console.error("getUserOrders Error:", error)
        return { success: false, error: "Error al obtener órdenes del usuario" }
    }
}

export async function getOrderById(id: number) {
    try {
        const orders: any[] = await query('SELECT * FROM orders WHERE id = ?', [id])
        if (orders.length === 0) return { success: false, error: "Order not found" }

        const items: any[] = await query('SELECT * FROM order_items WHERE order_id = ?', [id])

        const serializedOrder = {
            ...orders[0],
            total_amount: orders[0].total_amount?.toString() || "0",
            created_at: orders[0].created_at instanceof Date ? orders[0].created_at.toISOString() : orders[0].created_at,
            event_date: orders[0].event_date instanceof Date ? orders[0].event_date.toISOString() : orders[0].event_date,
            items: items.map(i => ({
                ...i,
                unit_price: i.unit_price?.toString() || "0",
                subtotal: i.subtotal?.toString() || "0"
            }))
        }

        return { success: true, data: serializedOrder }
    } catch (error) {
        console.error("getOrderById Error:", error)
        return { success: false, error: "Error al obtener detalles de la orden" }
    }
}

export async function updateOrderStatus(id: number, status: string) {
    try {
        await query('UPDATE orders SET status = ? WHERE id = ?', [status, id])
        revalidatePath('/admin/pedidos')
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Error al actualizar estado de la orden" }
    }
}

export async function createFullOrder(orderData: any, items: any[], total: number, orderId: string) {
    try {
        // 1. Insert Order
        const orderSql = `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, event_date, event_time, delivery_address, notes, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
        const eventDateStr = orderData.date // YYYY-MM-DD
        const eventTimeStr = orderData.time // HH:MM

        const result: any = await query(orderSql, [
            orderId,
            orderData.firstName + ' ' + orderData.lastName,
            orderData.email,
            orderData.phone,
            eventDateStr,
            eventTimeStr,
            orderData.address,
            orderData.notes,
            total
        ])

        const dbOrderId = result.insertId
        console.log("Orden guardada en BD con ID:", dbOrderId)

        // 2. Insert Items
        for (const item of items) {
            await query('INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?, ?)', [
                dbOrderId,
                item.id,
                item.name,
                item.quantity,
                item.price,
                item.price * item.quantity
            ])
        }

        // 3. Send Email
        try {
            await sendOrderEmail(orderData, items, total, orderId)
        } catch (emailErr) {
            console.error("Error enviando email, pero el pedido se guardó:", emailErr)
        }

        // 4. Revalidate
        revalidatePath('/admin/pedidos')
        revalidatePath('/admin')

        return { success: true, dbOrderId }
    } catch (error) {
        console.error("Create Order Error:", error)
        return { success: false, error: "Error al crear la orden en BD" }
    }
}

// --- Dashboard Stats ---
export async function getDashboardStats() {
    try {
        const salesRes: any[] = await query('SELECT SUM(total_amount) as total FROM orders WHERE status != "cancelled"')
        const ordersRes: any[] = await query('SELECT COUNT(*) as count FROM orders WHERE status = "pending"')
        const productsCount: any[] = await query('SELECT COUNT(*) as count FROM products')
        const customersCount: any[] = await query('SELECT COUNT(DISTINCT customer_email) as count FROM orders')

        return {
            sales: salesRes[0]?.total ? Number(salesRes[0].total) : 0,
            pendingOrders: Number(ordersRes[0]?.count) || 0,
            products: Number(productsCount[0]?.count) || 0,
            customers: Number(customersCount[0]?.count) || 0
        }
    } catch (error) {
        console.error("getDashboardStats Error:", error)
        return { sales: 0, pendingOrders: 0, products: 0, customers: 0 }
    }
}

export async function getPendingOrdersCount() {
    try {
        const res: any[] = await query('SELECT COUNT(*) as count FROM orders WHERE status = "pending"')
        return { success: true, count: Number(res[0]?.count) || 0 }
    } catch (error) {
        console.error("getPendingOrdersCount Error:", error)
        return { success: false, error: "Error al obtener conteo de pendientes" }
    }
}

export async function getRecentOrders(limit: number = 4) {
    try {
        const orders: any[] = await query(`SELECT * FROM orders ORDER BY created_at DESC LIMIT ${Number(limit)}`)

        // Serialize for Next.js Client Components (avoid Decimal/Date issues)
        const serializedOrders = orders.map(order => ({
            ...order,
            total_amount: order.total_amount?.toString() || "0",
            created_at: order.created_at instanceof Date ? order.created_at.toISOString() : order.created_at,
            event_date: order.event_date instanceof Date ? order.event_date.toISOString() : order.event_date
        }))

        return { success: true, data: serializedOrders }
    } catch (error) {
        console.error("Error in getRecentOrders:", error)
        return { success: false, error: "Error al obtener órdenes recientes" }
    }
}

// --- Authentication ---

export async function login(formData: FormData) {
    // Ensure DB and default user exist
    await setupDatabase()

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
        const users: any[] = await query('SELECT * FROM users WHERE email = ?', [email])
        if (users.length === 0) {
            return { success: false, error: "Credenciales inválidas" }
        }

        const user = users[0]
        const passwordMatch = await bcrypt.compare(password, user.password_hash)

        if (!passwordMatch) {
            return { success: false, error: "Credenciales inválidas" }
        }

        // Create Session
        const token = await new SignJWT({
            userId: user.id,
            email: user.email,
            role: user.role,
            name: user.full_name
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(SECRET_KEY)

        const cookieStore = await cookies()
        cookieStore.set("admin_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/"
        })

        // Update last login
        await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id])

        return { success: true }
    } catch (error) {
        console.error("Login Error:", error)
        return { success: false, error: "Error en el servidor" }
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete("admin_session")
    revalidatePath("/admin")
    return { success: true }
}

export async function getAdminSession() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("admin_session")?.value

        if (!token) return null

        const { payload } = await jwtVerify(token, SECRET_KEY)
        return payload
    } catch (error) {
        return null
    }
}

export async function getUsers() {
    try {
        const users = await query('SELECT id, full_name, email, role, created_at, last_login FROM users ORDER BY created_at DESC')
        // Serialize dates
        const serialized = (users as any[]).map(u => ({
            ...u,
            created_at: u.created_at instanceof Date ? u.created_at.toISOString() : u.created_at,
            last_login: u.last_login instanceof Date ? u.last_login.toISOString() : u.last_login
        }))
        return { success: true, data: serialized }
    } catch (error) {
        console.error("getUsers Error:", error)
        return { success: false, error: "Error al obtener usuarios" }
    }
}

export async function deleteUser(id: number) {
    try {
        await query('DELETE FROM users WHERE id = ?', [id])
        revalidatePath('/admin/usuarios')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Error al eliminar usuario" }
    }
}

export async function registerUser(formData: FormData) {
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
        // Check if user exists
        const existing: any[] = await query('SELECT id FROM users WHERE email = ?', [email])
        if (existing.length > 0) {
            return { success: false, error: "El email ya está registrado" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await query('INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [fullName, email, hashedPassword, 'cliente'])

        return { success: true }
    } catch (error) {
        console.error("Register Error:", error)
        return { success: false, error: "Error al registrar el usuario" }
    }
}
