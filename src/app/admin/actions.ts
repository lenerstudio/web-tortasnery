"use server"

import { query } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { sendOrderEmail } from "@/app/actions"
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

const SECRET_KEY = Buffer.from(process.env.JWT_SECRET || "tortasnery_super_secret_key_123456789", "utf8")

// --- Database Setup ---

export async function checkDatabaseConnection() {
    try {
        await query('SELECT 1')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Database Connection Failed" }
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
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`)

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

    try {
        await query(`INSERT INTO store_settings (id, store_name, contact_email, contact_phone, address) VALUES (1, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE store_name = ?, contact_email = ?, contact_phone = ?, address = ?`,
            [store_name, contact_email, contact_phone, address, store_name, contact_email, contact_phone, address])

        revalidatePath('/admin/configuracion')
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


// --- Products ---

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

        const sql = `INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)`
        await query(sql, [name, description, price, stock, categoryId, imageUrl])

        revalidatePath('/admin/productos')
        revalidatePath('/productos')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: "Failed to create product" }
    }
}

export async function getProductById(id: number) {
    try {
        const res: any[] = await query('SELECT * FROM products WHERE id = ?', [id])
        if (res.length > 0) return { success: true, data: res[0] }
        return { success: false, error: "Producto no encontrado" }
    } catch (error) {
        return { success: false, error: "Failed to fetch product" }
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

        let categoryId: number | null = null;
        if (categoryName) {
            if (!isNaN(parseInt(categoryName)) && /^\d+$/.test(categoryName)) {
                categoryId = parseInt(categoryName)
            } else {
                let cats: any[] = await query('SELECT id FROM categories WHERE slug = ? OR name = ?', [categoryName.toLowerCase(), categoryName])
                if (cats.length > 0) categoryId = cats[0].id
            }
        }

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
        return { success: false, error: "Failed to toggle featured status" }
    }
}

export async function getFeaturedProducts() {
    try {
        const products = await query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_featured = TRUE ORDER BY p.updated_at DESC')
        return { success: true, data: products }
    } catch (error) {
        return { success: false, error: "Failed to fetch featured products" }
    }
}

export async function deleteProduct(id: number) {
    try {
        await query('DELETE FROM products WHERE id = ?', [id])
        revalidatePath('/admin/productos')
        revalidatePath('/productos')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete" }
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
        return { success: false, error: "Failed to fetch orders" }
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
        return { success: false, error: "Failed to fetch user orders" }
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
        return { success: false, error: "Failed to fetch order details" }
    }
}

export async function updateOrderStatus(id: number, status: string) {
    try {
        await query('UPDATE orders SET status = ? WHERE id = ?', [status, id])
        revalidatePath('/admin/pedidos')
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to update order status" }
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
        return { success: false, error: "Failed to create order in DB" }
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
        return { success: false, error: "Failed to fetch recent orders" }
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
        return { success: false, error: "Failed to fetch users" }
    }
}

export async function deleteUser(id: number) {
    try {
        await query('DELETE FROM users WHERE id = ?', [id])
        revalidatePath('/admin/usuarios')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete user" }
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
