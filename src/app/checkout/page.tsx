"use client"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ArrowLeft, CheckCircle2, Send, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/sections/navbar"
import { Footer } from "@/components/sections/footer"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { sendOrderEmail } from "@/app/actions"

export default function CheckoutPage() {
    const { cartTotal, items, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        address: "",
        notes: ""
    })
    const [orderNumber, setOrderNumber] = useState<string>("")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const [orderSnapshot, setOrderSnapshot] = useState<{ items: typeof items, total: number } | null>(null)

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Generate Order Number
        const newOrderNumber = Math.floor(Math.random() * 900000) + 100000
        setOrderNumber(newOrderNumber.toString())

        // Snapshot cart for success screen
        setOrderSnapshot({ items: [...items], total: cartTotal })

        // Send Email (Server Action)
        try {
            const result = await sendOrderEmail(formData, items, cartTotal, newOrderNumber.toString())
            if (!result.success) {
                console.error("Fallo en el envío de email:", result.error)
                setEmailError(true)
            }
        } catch (error) {
            console.error("Error crítico al llamar server action:", error)
            setEmailError(true)
        }

        setLoading(false)
        setCompleted(true)
        clearCart()
    }

    if (completed && orderSnapshot) {
        const message = `Hola Tortas Nery, soy *${formData.firstName} ${formData.lastName}*.\n\nHe realizado el pedido *#${orderNumber}* por un total de *S/ ${orderSnapshot.total}*.\n\n*Detalles del Pedido:*\n${orderSnapshot.items.map(item => `- ${item.name} (x${item.quantity})`).join('\n')}\n\n*Fecha del Evento:* ${formData.date} a las ${formData.time}\n*Envío a:* ${formData.address}\n*Notas:* ${formData.notes || "Ninguna"}\n*Email:* ${formData.email}`
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/51997935991?text=${encodedMessage}`

        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center space-y-8 animate-fade-in-up">
                <div className="bg-green-100 p-6 rounded-full inline-block animate-bounce">
                    <CheckCircle2 className="w-20 h-20 text-green-600" />
                </div>

                <div className="space-y-4 max-w-lg mx-auto">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">¡Pedido Recibido!</h1>

                    {emailError ? (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-sm">
                            <p className="font-bold">Nota Importante:</p>
                            <p>No pudimos enviar el correo de confirmación automáticamente (posiblemente por configuración del servidor).</p>
                            <p className="mt-2 font-semibold">¡No te preocupes! Tu pedido está seguro. Simplemente envíanos los detalles por WhatsApp a continuación.</p>
                        </div>
                    ) : (
                        <p className="text-lg text-muted-foreground font-light leading-relaxed">
                            Hemos enviado la confirmación a <strong>{formData.email}</strong>.
                            <br />
                            Para agilizar tu atención, por favor envíanos el detalle de tu pedido por WhatsApp.
                        </p>
                    )}
                </div>

                <div className="bg-secondary/5 p-6 rounded-2xl border border-secondary/20 max-w-sm mx-auto w-full mb-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Tu Número de Orden</p>
                    <p className="text-4xl font-serif font-bold text-primary">#{orderNumber}</p>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
                    <Button asChild className="bg-[#25D366] hover:bg-[#128C7E] text-white hover:text-white rounded-full px-8 py-6 text-lg shadow-xl shadow-green-500/20 transition-all hover:-translate-y-1 group">
                        <Link href={whatsappUrl} target="_blank">
                            <MessageCircle className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                            Enviar a WhatsApp
                        </Link>
                    </Button>

                    <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                        <Link href="/">Volver al Inicio</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 container max-w-6xl py-12 md:py-20">

                <div className="flex items-center gap-4 mb-10">
                    <Link href="/carrito" className="p-2 -ml-2 rounded-full hover:bg-secondary/20 transition-colors text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Finalizar Compra</h1>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 lg:gap-24">

                    {/* Form Section */}
                    <div className="lg:col-span-3 space-y-10">
                        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">

                            {/* Customer Info */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif font-bold border-b border-border/40 pb-4 text-foreground">1. Datos Personales</h2>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-sm font-light uppercase tracking-wider text-muted-foreground">Nombre</Label>
                                        <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Tu nombre" required className="h-12 bg-secondary/5 border-secondary/20 rounded-xl focus:border-primary/50 transition-colors font-light" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-sm font-light uppercase tracking-wider text-muted-foreground">Apellido</Label>
                                        <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Tu apellido" required className="h-12 bg-secondary/5 border-secondary/20 rounded-xl focus:border-primary/50 transition-colors font-light" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-light uppercase tracking-wider text-muted-foreground">Email</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="ejemplo@correo.com" required className="h-12 bg-secondary/5 border-secondary/20 rounded-xl focus:border-primary/50 transition-colors font-light" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-light uppercase tracking-wider text-muted-foreground">Teléfono / WhatsApp</Label>
                                    <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+51 997 935 991" required className="h-12 bg-secondary/5 border-secondary/20 rounded-xl focus:border-primary/50 transition-colors font-light" />
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif font-bold border-b border-border/40 pb-4 text-foreground">2. Detalles del Evento</h2>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="date" className="text-sm font-light uppercase tracking-wider text-muted-foreground">Fecha del Evento</Label>
                                        <Input id="date" type="date" value={formData.date} onChange={handleInputChange} required className="h-12 bg-secondary/5 border-secondary/20 rounded-xl focus:border-primary/50 transition-colors font-light" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="time" className="text-sm font-light uppercase tracking-wider text-muted-foreground">Hora de Recepción</Label>
                                        <Input id="time" type="time" value={formData.time} onChange={handleInputChange} required className="h-12 bg-secondary/5 border-secondary/20 rounded-xl focus:border-primary/50 transition-colors font-light" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-sm font-light uppercase tracking-wider text-muted-foreground">Dirección del Local / Casa</Label>
                                    <Input id="address" value={formData.address} onChange={handleInputChange} placeholder="Calle, número, urbanización..." required className="h-12 bg-secondary/5 border-secondary/20 rounded-xl focus:border-primary/50 transition-colors font-light" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="notes" className="text-sm font-light uppercase tracking-wider text-muted-foreground">Notas para el Chef (Opcional)</Label>
                                    <Textarea id="notes" value={formData.notes} onChange={handleInputChange} placeholder="Alergias, colores específicos, dedicatoria..." className="min-h-[100px] bg-secondary/5 border-secondary/20 rounded-xl resize-none focus:border-primary/50 transition-colors font-light" />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="bg-white border text-foreground shadow-2xl shadow-black/5 rounded-[2rem] overflow-hidden sticky top-24 transform transition-all hover:scale-[1.01]">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-accent/10 rounded-bl-[100px] -z-0 opacity-50" />

                            <CardContent className="p-8 space-y-6 relative z-10">
                                <h3 className="font-serif font-bold text-2xl mb-4 text-foreground">Tu Pedido</h3>

                                {/* Mini Items List */}
                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4 items-center border-b border-border/20 pb-4 last:border-0 group">
                                            <div className="w-16 h-16 rounded-xl bg-secondary/20 relative overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition-all">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-base font-serif font-bold line-clamp-1 text-foreground">{item.name}</p>
                                                <p className="text-xs text-muted-foreground font-light mt-1">Cant: {item.quantity}</p>
                                            </div>
                                            <div className="text-base font-bold text-primary whitespace-nowrap">S/ {item.price * item.quantity}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-6 border-t border-border/40 text-sm">
                                    <div className="flex justify-between text-muted-foreground font-light">
                                        <span>Subtotal</span>
                                        <span>S/ {cartTotal}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground font-light">
                                        <span>Impuestos</span>
                                        <span>S/ 0.00</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-serif font-bold text-foreground pt-4 border-t border-border/20 mt-2">
                                        <span>Total</span>
                                        <span>S/ {cartTotal}</span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    form="checkout-form"
                                    className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-bold rounded-xl text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                    disabled={loading || items.length === 0}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <MessageCircle className="w-5 h-5" /> Confirmar pedido
                                        </>
                                    )}
                                </Button>

                                <div className="text-center pt-2">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2 font-medium">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Pagos Seguros con SSL
                                    </p>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    )
}
