-- 1. Tabla de Usuarios (Administradores y Clientes)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 2. Tabla de Categorías (Organización de productos)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Productos (Catálogo)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT,
    stock INT NOT NULL DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 4. Tabla de Pedidos (Orders)
CREATE TABLE orders (
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
);

-- 5. Tabla de Detalles del Pedido
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- 6. Datos Semilla (Categorías y Usuario Admin por defecto)
INSERT INTO categories (name, slug) VALUES 
('Bodas', 'bodas'),
('XV Años', 'xv-anos'),
('Especiales', 'especiales');

-- Usuario Admin por defecto (Password: 'admin123' - *NOTA: En producción esto debe ser un hash real*)
INSERT INTO users (full_name, email, password_hash, role) VALUES 
('Admin Tortas Nery', 'admin@tortasnery.com', '$2a$12$R9h/cIPz0gi.URNNXRFXjOios9ksf6BW.pjAQ.kX7.1Qx.u.X/jO', 'admin');
