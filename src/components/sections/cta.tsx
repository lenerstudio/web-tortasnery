"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Loader2, CalendarHeart, Sparkles, Send } from "lucide-react"

export function CTA() {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setLoading(false)
        alert("¡Mensaje enviado! Te contactaremos pronto.")
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

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Nombre</Label>
                                <Input id="firstName" placeholder="Tu nombre" className="bg-muted/30 border-muted-foreground/20 focus:border-primary/50 h-12 rounded-xl" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Apellido</Label>
                                <Input id="lastName" placeholder="Tu apellido" className="bg-muted/30 border-muted-foreground/20 focus:border-primary/50 h-12 rounded-xl" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</Label>
                            <Input id="email" type="email" placeholder="tucorreo@ejemplo.com" className="bg-muted/30 border-muted-foreground/20 focus:border-primary/50 h-12 rounded-xl" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Teléfono</Label>
                            <Input id="phone" type="tel" placeholder="+51 997 935 991" className="bg-muted/30 border-muted-foreground/20 focus:border-primary/50 h-12 rounded-xl" required />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Fecha</Label>
                                <Input id="date" type="date" className="bg-muted/30 border-muted-foreground/20 focus:border-primary/50 h-12 rounded-xl" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Evento</Label>
                                <Select>
                                    <SelectTrigger className="bg-muted/30 border-muted-foreground/20 h-12 rounded-xl">
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
                            <Textarea id="message" placeholder="Cuéntanos sobre tu estilo, colores o temática..." className="bg-muted/30 border-muted-foreground/20 focus:border-primary/50 rounded-xl min-h-[120px] resize-none" />
                        </div>

                        <Button type="submit" size="lg" className="w-full text-lg h-14 bg-foreground text-white hover:bg-foreground/90 font-bold shadow-lg transition-all rounded-xl mt-4" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                            Solicitar Propuesta
                        </Button>
                    </form>
                </div>

            </div>
        </section>
    )
}
