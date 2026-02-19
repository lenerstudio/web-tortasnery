"use client"
import * as React from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"
import Image from "next/image"

export function Testimonials() {
    const testimonials = [
        {
            name: "Mariana & Carlos",
            role: "Boda en Hacienda P.",
            text: "La torta fue el tema de conversación de toda la noche. ¡Y el sabor! Nunca habíamos probado algo tan delicioso y hermoso a la vez.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=400",
            gradient: "from-primary/20 via-primary/5 to-transparent"
        },
        {
            name: "Ana Sofía",
            role: "Quinceañera",
            text: "Tortas Nery captó exactamente lo que quería. Mi fiesta de 15 tuvo el toque mágico gracias a su diseño floral. 100% recomendados.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
            gradient: "from-accent/20 via-accent/5 to-transparent"
        },
        {
            name: "Lucía Fernández",
            role: "Editora - Revista Bodas",
            text: "Una de las mejores pasteleras de la región. Sus diseños florales son indistinguibles de los reales. Una verdadera artista.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
            gradient: "from-secondary/50 via-secondary/10 to-transparent"
        },
        {
            name: "Valeria & Jorge",
            role: "Boda Civil",
            text: "La elegancia y el detalle en cada flor de azúcar es impresionante. Superaron nuestras expectativas por completo.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
            gradient: "from-primary/20 via-primary/5 to-transparent"
        },
    ]

    return (
        <section id="testimonios" className="py-16 md:py-20 bg-background overflow-hidden relative">
            {/* Decorative BG */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
            <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent/80 border px-3 py-1 rounded-full border-accent/20">Historias Reales</span>
                    <h2 className="text-3xl font-serif font-medium tracking-tight sm:text-4xl md:text-5xl mb-4 text-foreground">Lo que dicen nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic">clientes felices</span></h2>
                </div>

                <Carousel className="w-full max-w-6xl mx-auto" opts={{ align: "start", loop: true }}>
                    <CarouselContent className="-ml-4 pb-10">
                        {testimonials.map((t, i) => (
                            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3 pl-4">
                                <div className="p-1 h-full">
                                    <div className="group relative h-full">
                                        {/* Hover Glow */}
                                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${i % 2 === 0 ? 'from-primary/30 to-accent/30' : 'from-accent/30 to-primary/30'} rounded-[2.2rem] blur opacity-0 group-hover:opacity-75 transition duration-500`} />

                                        <Card className="relative border-0 bg-white/60 backdrop-blur-md shadow-sm h-full rounded-[2rem] overflow-hidden transition-all duration-300 group-hover:-translate-y-2">
                                            <div className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b ${t.gradient} opacity-50`} />

                                            <CardContent className="flex flex-col p-8 text-center h-full relative z-10">

                                                <div className="mx-auto mb-6 relative w-24 h-24 p-1 rounded-full bg-background border border-primary/10 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                    <div className="relative w-full h-full rounded-full overflow-hidden">
                                                        <Image src={t.image} alt={t.name} fill className="object-cover" />
                                                    </div>
                                                </div>

                                                <div className="mb-6 opacity-30 group-hover:opacity-100 transition-opacity duration-300">
                                                    <Quote className="h-8 w-8 text-primary mx-auto rotate-180" />
                                                </div>

                                                <p className="text-muted-foreground font-light mb-8 flex-grow leading-relaxed text-[0.95rem]">"{t.text}"</p>

                                                <div className="mt-auto pt-6 border-t border-primary/5 w-full">
                                                    <h4 className="font-serif font-bold text-foreground text-lg">{t.name}</h4>
                                                    <span className="text-xs text-accent uppercase tracking-widest font-bold block mt-1">{t.role}</span>
                                                    <div className="flex justify-center text-primary text-xs mt-3 gap-1">
                                                        {"★".repeat(t.rating)}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex -left-12 bg-white/80 hover:bg-white border-primary/10 text-primary hover:text-accent shadow-lg w-12 h-12 rounded-full transition-all" />
                    <CarouselNext className="hidden md:flex -right-12 bg-white/80 hover:bg-white border-primary/10 text-primary hover:text-accent shadow-lg w-12 h-12 rounded-full transition-all" />
                </Carousel>
            </div>
        </section>
    )
}
