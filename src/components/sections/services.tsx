import { Flower, Palette, Gem, Truck } from "lucide-react"

export function Services() {
    const services = [
        {
            icon: <Palette className="w-8 h-8 text-primary" />,
            title: "Diseño 100% Único",
            desc: "Sin réplicas. Cada torta es una obra de arte original diseñada desde cero para armonizar con la estética de tu boda o evento."
        },
        {
            icon: <Flower className="w-8 h-8 text-accent" />,
            title: "Flores de Azúcar",
            desc: "Nuestra firma exclusiva. Pétalo a pétalo, creamos botánica comestible que rivaliza con la naturaleza, pintada a mano."
        },
        {
            icon: <Gem className="w-8 h-8 text-primary" />,
            title: "Ingredientes Gourmet",
            desc: "Usamos mantequilla de campo, huevos orgánicos y chocolates europeos. Lo lindo SÍ es rico."
        },
        {
            icon: <Truck className="w-8 h-8 text-accent" />,
            title: "Logística y Montaje",
            desc: "Llegamos 2 horas antes. Montamos la torta en el lugar y garantizamos que luzca impecable. Cero estrés para ti."
        }
    ]

    return (
        <section id="servicios" className="py-16 md:py-20 relative overflow-hidden bg-muted/20">
            {/* Background Subtle Gradients */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 mix-blend-multiply" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 mix-blend-multiply" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-20 space-y-4">
                    <span className="text-accent uppercase tracking-[0.2em] text-xs font-bold bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-accent/10 shadow-sm">
                        Nuestra Propuesta de Valor
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif text-foreground font-medium mt-6">
                        La Excelencia en <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Cada Detalle</span>
                    </h2>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-light leading-relaxed">
                        Más que una pastelería, somos un estudio de diseño comestible donde la técnica se encuentra con el sabor.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {services.map((service, index) => (
                        <div key={index} className="group relative bg-white/40 backdrop-blur-sm p-1 rounded-[2rem] hover:-translate-y-2 transition-transform duration-500">
                            {/* Gradient Border Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary/20 rounded-[2rem] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                            <div className="relative h-full bg-white/80 backdrop-blur-xl rounded-[1.9rem] p-8 flex flex-col items-center text-center shadow-sm group-hover:shadow-xl transition-shadow duration-500 border border-white/50">
                                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-serif font-bold mb-4 text-foreground">{service.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm font-light">{service.desc}</p>

                                {/* Bottom Accent Line */}
                                <div className="mt-auto pt-6 w-full flex justify-center">
                                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 group-hover:from-primary group-hover:to-accent transition-all duration-500 group-hover:w-24" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
