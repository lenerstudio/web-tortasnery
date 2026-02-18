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
            // Portrait of a happy bride (New working link)
            image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=400"
        },
        {
            name: "Ana Sofía",
            role: "Quinceañera",
            text: "Tortas Nery captó exactamente lo que quería. Mi fiesta de 15 tuvo el toque mágico gracias a su diseño floral. 100% recomendados.",
            rating: 5,
            // Young woman portrait (New working link)
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400"
        },
        {
            name: "Lucía Fernández",
            role: "Editora - Revista Bodas",
            text: "Una de las mejores pasteleras de la región. Sus diseños florales son indistinguibles de los reales. Una verdadera artista.",
            rating: 5,
            // Professional woman (Existing working link)
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
        },
        {
            name: "Valeria & Jorge",
            role: "Boda Civil",
            text: "La elegancia y el detalle en cada flor de azúcar es impresionante. Superaron nuestras expectativas por completo.",
            rating: 5,
            // Happy woman portrait (Existing working link)
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
        },
    ]

    return (
        <section id="testimonios" className="py-24 bg-background overflow-hidden relative">
            {/* Decorative BG */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent/80">Historias Reales</span>
                    <h2 className="text-3xl font-serif font-medium tracking-tight sm:text-4xl md:text-5xl mb-4 text-foreground">Lo que dicen nuestros <span className="text-secondary-foreground italic decoration-primary/30 underline decoration-wavy underline-offset-4">clientes felices</span></h2>
                </div>

                <Carousel className="w-full max-w-5xl mx-auto" opts={{ align: "start", loop: true }}>
                    <CarouselContent className="-ml-4">
                        {testimonials.map((t, i) => (
                            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3 pl-4">
                                <div className="p-1 h-full">
                                    <Card className="border border-secondary bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all h-full rounded-[2rem] overflow-hidden group">
                                        <CardContent className="flex flex-col p-8 text-center h-full relative">

                                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            <div className="mx-auto mb-6 relative w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-500">
                                                <Image src={t.image} alt={t.name} fill className="object-cover" />
                                            </div>

                                            <div className="mb-4">
                                                <Quote className="h-8 w-8 text-primary/20 mx-auto rotate-180" />
                                            </div>

                                            <p className="text-muted-foreground font-light italic mb-8 flex-grow leading-relaxed text-sm">"{t.text}"</p>

                                            <div className="mt-auto border-t border-secondary/50 pt-6">
                                                <h4 className="font-serif font-bold text-foreground text-lg">{t.name}</h4>
                                                <span className="text-xs text-accent uppercase tracking-widest font-medium block mt-1">{t.role}</span>
                                                <div className="flex justify-center text-primary text-xs mt-3 gap-1">
                                                    {"★".repeat(t.rating)}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex -left-16 border-primary/20 hover:bg-primary/10 text-primary w-12 h-12 rounded-full" />
                    <CarouselNext className="hidden md:flex -right-16 border-primary/20 hover:bg-primary/10 text-primary w-12 h-12 rounded-full" />
                </Carousel>
            </div>
        </section>
    )
}
