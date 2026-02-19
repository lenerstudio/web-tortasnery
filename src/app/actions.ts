"use server"

import nodemailer from 'nodemailer'

interface OrderData {
  firstName: string
  lastName: string
  email: string
  phone: string
  date: string
  time: string
  address: string
  notes?: string
}

interface OrderItem {
  name: string
  quantity: number
  price: number
}

// Configuración del transporte de correo (SMTP)
// Necesitas configurar GMAIL_USER y GMAIL_APP_PASSWORD en tu archivo .env.local
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Tu correo de Gmail
    pass: process.env.GMAIL_APP_PASSWORD, // Tu contraseña de aplicación (App Password)
  },
})

export async function sendOrderEmail(formData: OrderData, items: OrderItem[], total: number, orderId: string) {
  const { firstName, lastName, email, phone, date, time, address, notes } = formData

  // Contenido HTML del correo
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #d4a373; margin: 0; font-family: 'Georgia', serif; } /* Tono dorado/elegante */
          .order-info { background-color: #fdfdfd; padding: 15px; border-radius: 8px; border: 1px solid #eee; margin-bottom: 20px; }
          .item { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 12px 0; }
          .item:last-child { border-bottom: none; }
          .total { font-weight: bold; font-size: 1.3em; text-align: right; margin-top: 20px; color: #333; border-top: 2px solid #333; padding-top: 10px; }
          .footer { margin-top: 30px; font-size: 0.8em; text-align: center; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Gracias por tu pedido, ${firstName}!</h1>
            <p>Hemos recibido tu orden <strong>#${orderId}</strong> y estamos emocionados de ser parte de tu celebración.</p>
          </div>
          
          <div class="order-info">
            <h3 style="margin-top:0;">Detalles del Evento</h3>
            <p><strong>Fecha:</strong> ${date} a las ${time}</p>
            <p><strong>Dirección:</strong> ${address}</p>
            <p><strong>Contacto:</strong> ${phone}</p>
            ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ''}
          </div>

          <div class="items">
            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Tu Selección</h3>
            ${items.map(item => `
              <div class="item">
                <span style="font-weight: 500;">${item.name} <span style="font-size: 0.9em; color: #666;">(x${item.quantity})</span></span>
                <span>S/ ${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
            
            <div class="total">
              Total: S/ ${total.toFixed(2)}
            </div>
          </div>

          <div class="footer">
            <p>Si tienes alguna pregunta, contáctanos por WhatsApp al <a href="https://wa.me/51997935991" style="color: #d4a373; text-decoration: none;">+51 997 935 991</a>.</p>
            <p><strong>Tortas Nery</strong> - Arte Comestible</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    const mailOptions = {
      from: '"Tortas Nery" <lenermatos128@gmail.com>', // Remitente
      to: [email, 'lenermatos128@gmail.com'], // Enviar copia al cliente y al administrador
      subject: `Confirmación de Pedido #${orderId} - Tortas Nery`,
      html: htmlContent,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email enviado: %s", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error al enviar email:", error)
    return { success: false, error: 'Error al enviar el correo. Por favor verifica tus credenciales.' }
  }
}

// Fetch featured products for the landing page
export async function getFeaturedProducts() {
  // Import query here to avoid circular dependencies if any, 
  // but better to import at top if possible.
  const { query } = await import("@/lib/db")

  try {
    const products = await query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_featured = TRUE ORDER BY p.updated_at DESC LIMIT 6')
    return { success: true, data: products }
  } catch (error) {
    console.error("fetch featured error:", error)
    return { success: false, error: "Failed to fetch featured products" }
  }
}
