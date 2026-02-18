export function Audience() {
    return (
        <section className="py-24 bg-muted/30 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/50 -z-10" />

            <div className="container space-y-16 text-center">
                <div className="space-y-4 max-w-2xl mx-auto">
                    <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase border-b border-accent/20 pb-2 inline-block">¿Es este servicio para ti?</span>
                    <h2 className="text-3xl font-serif text-foreground md:text-5xl font-medium tracking-tight">
                        Diseñado exclusivamente para quienes <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic">valoran los detalles</span>
                    </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto text-left">
                    {[
                        { title: "Novios Exigentes", desc: "Buscan una pieza central que refleje su historia de amor y deje a los invitados maravillados." },
                        { title: "Padres de Quinceañeras", desc: "Quieren celebrar la transición de niña a mujer con una obra de arte dulce e inolvidable." },
                        { title: "Wedding Planners", desc: "Necesitan proveedores de confianza que garanticen puntualidad, calidad y montaje impecable." }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white/80 backdrop-blur-md p-10 rounded-[2rem] shadow-sm border border-primary/10 hover:border-primary/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                            <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent mb-6 rounded-full group-hover:w-24 transition-all duration-500" />
                            <h3 className="font-serif text-2xl font-bold mb-4 text-foreground">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed font-light">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
