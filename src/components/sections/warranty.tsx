import { ShieldCheck, Truck, Sparkles } from "lucide-react"

export function Warranty() {
    const warranties = [
        {
            icon: <ShieldCheck className="w-10 h-10 text-primary" />,
            title: "Satisfacción Garantizada",
            text: "Si la propuesta de diseño o sabor en la degustación no supera tus expectativas, te reembolsamos el costo de la sesión sin preguntas.",
            gradient: "from-primary/5 to-transparent"
        },
        {
            icon: <Truck className="w-10 h-10 text-accent/80" />,
            title: "Puntualidad por Contrato",
            text: "Tu torta estará montada y perfecta 2 horas antes de que llegue el primer invitado. Si no, te bonificamos el 50% del valor.",
            gradient: "from-accent/5 to-transparent"
        },
        {
            icon: <Sparkles className="w-10 h-10 text-primary" />,
            title: "Blindaje ante Percances",
            text: "Viajamos con un 'Kit de Emergencia' que incluye réplicas de flores y decoraciones para reparar cualquier daño imprevisto al instante.",
            gradient: "from-primary/5 to-transparent"
        }
    ]

    return (
        <section className="py-16 md:py-20 bg-background relative overflow-hidden">
            {/* Decorative Radial Gradients */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/3" />

            <div className="container relative text-center max-w-6xl space-y-20">
                <div className="space-y-6 animate-fade-in-up">
                    <span className="inline-block px-4 py-1.5 rounded-full border border-secondary bg-secondary/20 text-secondary-foreground font-bold text-xs tracking-[0.2em] uppercase">
                        Compromiso de Calidad
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground tracking-tight">
                        Nuestra Promesa: <br className="hidden md:block" /> <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent relative inline-block pb-2">Tu Tranquilidad Absoluta</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 text-left">
                    {warranties.map((item, i) => (
                        <div key={i} className={`group relative bg-white p-1 rounded-[2.5rem] hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 delay-[${i * 100}ms]`}>
                            {/* Gradient Border via Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-white to-white rounded-[2.5rem] -z-10 group-hover:from-primary/30 group-hover:via-accent/20 transition-colors duration-500" />

                            <div className="h-full bg-white/50 backdrop-blur-xl rounded-[2.4rem] p-8 md:p-10 flex flex-col items-center text-center border border-white/60">
                                <div className={`mb-8 p-6 rounded-full bg-gradient-to-br ${item.gradient} group-hover:scale-110 transition-transform duration-500 shadow-sm border border-white/50`}>
                                    {item.icon}
                                </div>

                                <h3 className="font-serif font-bold text-2xl mb-4 text-foreground group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed font-light">{item.text}</p>

                                {/* Interactive element */}
                                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                                    Saber más <div className="w-8 h-[1px] bg-accent" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
