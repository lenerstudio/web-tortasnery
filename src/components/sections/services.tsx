import { Flower, Palette, Gem, Truck } from "lucide-react"

export function Services() {
    const services = [
        {
            icon: <Palette className="w-10 h-10 text-primary" />,
            title: "Diseño 100% Único",
            desc: "Sin réplicas. Cada torta es una obra de arte original diseñada desde cero para armonizar con la estética de tu boda o evento."
        },
        {
            icon: <Flower className="w-10 h-10 text-accent" />,
            title: "Flores de Azúcar",
            desc: "Nuestra firma exclusiva. Pétalo a pétalo, creamos botánica comestible que rivaliza con la naturaleza, pintada a mano."
        },
        {
            icon: <Gem className="w-10 h-10 text-primary" />,
            title: "Ingredientes Gourmet",
            desc: "Usamos mantequilla de campo, huevos orgánicos y chocolates europeos. Lo lindo SÍ es rico."
        },
        {
            icon: <Truck className="w-10 h-10 text-accent" />,
            title: "Logística y Montaje",
            desc: "Llegamos 2 horas antes. Montamos la torta en el lugar y garantizamos que luzca impecable. Cero estrés para ti."
        }
    ]

    return (
        <section id="servicios" className="py-24 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/50 to-background -z-20" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/30 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="container px-4 md:px-6">
                <div className="text-center mb-20 space-y-4">
                    <span className="text-accent uppercase tracking-[0.2em] text-xs font-bold bg-accent/5 px-4 py-2 rounded-full border border-accent/20">
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
                        <div key={index} className="group flex flex-col items-center text-center p-8 bg-white/70 backdrop-blur-md rounded-[2rem] shadow-sm border border-primary/10 hover:border-primary/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                            {/* Card Decoration */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="mb-6 p-5 bg-gradient-to-br from-secondary to-white rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-serif font-bold mb-4 text-foreground">{service.title}</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm font-light">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
