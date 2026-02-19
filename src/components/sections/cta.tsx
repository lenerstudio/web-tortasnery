"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Loader2, CalendarHeart, Sparkles, Send, CheckCircle, MessageCircle } from "lucide-react"
import { sendContactEmail } from "@/app/actions"
import { toast } from "sonner"

export function CTA() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [eventType, setEventType] = useState("")
    const [lastData, setLastData] = useState<any>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const form = e.target as HTMLFormElement
        const data = {
            firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
            lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
            date: (form.elements.namedItem('date') as HTMLInputElement).value,
            type: eventType,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value
        }

        const res = await sendContactEmail(data)
        setLoading(false)

        if (res?.success) {
            setLastData(data)
            setSubmitted(true)
            toast.success("¡Mensaje enviado con éxito!")
        } else {
            toast.error("Hubo un error al enviar el mensaje. Inténtalo de nuevo.")
        }
    }

    const handleWhatsApp = () => {
        if (!lastData) return
        const text = `Hola, soy ${lastData.firstName} ${lastData.lastName}. Acabo de enviar una solicitud por la web para mi evento (${lastData.type}) el día ${lastData.date}. Quisiera más información.`
        const url = `https://wa.me/51997935991?text=${encodeURIComponent(text)}`
        window.open(url, '_blank')
    }

    return (
        <section id="contacto" className="py-16 md:py-20 relative overflow-hidden bg-foreground text-white">
            {/* Background Image/Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-foreground to-foreground -z-20" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="container grid lg:grid-cols-2 gap-16 items-center">

                {/* Text Side */}
                <div className="space-y-10 animate-fade-in-up">
                    <div className="space-y-4">
                        <span className="text-secondary font-bold text-xs uppercase tracking-[0.2em] opacity-80 border-b border-secondary/20 pb-2 inline-block">¿Lista para el "Sí, quiero"?</span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.1] text-white">
                            Comienza el viaje hacia tu torta <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic">soñada</span>.
                        </h2>
                    </div>

                    <p className="text-lg text-white/70 font-light leading-relaxed max-w-lg">
                        Completa el formulario para verificar disponibilidad de tu fecha y recibir una propuesta preliminar personalizada.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6 pt-4">
                        <div className="flex gap-4 items-start">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <CalendarHeart className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-white mb-1">Disponibilidad</h4>
                                <p className="text-xs text-white/50 leading-relaxed">Verificamos tu fecha al instante para asegurar nuestro compromiso.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <Sparkles className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-white mb-1">Propuesta Visual</h4>
                                <p className="text-xs text-white/50 leading-relaxed">Recibe un moodboard preliminar basado en tu estilo.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-black/50 relative overflow-hidden text-foreground">

                    {submitted ? (
                        <div className="flex flex-col items-center justify-center text-center space-y-6 py-10 animate-in fade-in zoom-in duration-500">
                            <div className="bg-green-100 p-4 rounded-full">
                                <CheckCircle className="w-16 h-16 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">¡Mensaje Enviado!</h3>
                                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                    Gracias por contactarnos. Hemos recibido tu información y te responderemos a la brevedad posible.
                                </p>
                            </div>

                            <div className="w-full pt-6 border-t border-border space-y-4">
                                <p className="text-sm font-medium text-foreground/80">¿Quieres una respuesta más rápida?</p>
                                <Button
                                    onClick={handleWhatsApp}
                                    variant="outline"
                                    className="w-full h-12 gap-2 border-green-500 text-green-700 hover:bg-green-50 hover:text-green-800 font-bold rounded-xl transition-colors"
                                >
                                    <MessageCircle className="w-5 h-5" /> Enviar también por WhatsApp
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setSubmitted(false)}
                                    className="text-muted-foreground text-xs hover:text-foreground"
                                >
                                    Volver al formulario
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Nombre</Label>
                                    <Input id="firstName" name="firstName" placeholder="Tu nombre" className="bg-muted/30 border-muted-foreground/20 focus:border-primary/50 h-10 rounded-xl" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Apellido</Label>
                                    <Input id="lastName" name="lastName" placeholder="Tu apellido" className="bg-muted/30 border-muted-foreground/20 focus:border-primary/50 h-10 rounded-xl" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="tucorreo@ejemplo.com" className="bg-muted/30 border-muted-foreground/20 focus:border-primary/50 h-10 rounded-xl" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Teléfono</Label>
                                <Input id="phone" name="phone" type="tel" placeholder="+51 997 935 991" className="bg-muted/30 border-muted-foreground/20 focus:border-primary/50 h-10 rounded-xl" required />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="date" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Fecha</Label>
                                    <Input id="date" name="date" type="date" className="bg-muted/30 border-muted-foreground/20 focus:border-primary/50 h-10 rounded-xl" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Evento</Label>
                                    <Select onValueChange={setEventType} required>
                                        <SelectTrigger className="bg-muted/30 border-muted-foreground/20 h-10 rounded-xl">
                                            <SelectValue placeholder="Selecciona..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="boda">Boda</SelectItem>
                                            <SelectItem value="xv">Quinceañero</SelectItem>
                                            <SelectItem value="civil">Boda Civil</SelectItem>
                                            <SelectItem value="otro">Otro Evento</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Tu Idea</Label>
                                <Textarea id="message" name="message" placeholder="Cuéntanos sobre tu estilo, colores o temática..." className="bg-muted/30 border-muted-foreground/20 focus:border-primary/50 rounded-xl min-h-[100px] resize-none" />
                            </div>

                            <Button type="submit" size="lg" className="w-full text-lg h-12 bg-foreground text-white hover:bg-foreground/90 font-bold shadow-lg transition-all rounded-xl mt-4" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                                Solicitar Propuesta
                            </Button>
                        </form>
                    )}
                </div>

            </div>
        </section>
    )
}
