export function Audience() {
    return (
        <section className="py-16 md:py-20 bg-background relative overflow-hidden">

            <div className="container space-y-16 text-center relative z-10">
                <div className="space-y-4 max-w-2xl mx-auto">
                    <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase border-b border-accent/20 pb-2 inline-block">¿Es este servicio para ti?</span>
                    <h2 className="text-3xl font-serif text-foreground md:text-5xl font-medium tracking-tight">
                        Diseñado exclusivamente para quienes <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic">no se conforman</span>
                    </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto text-left">
                    {[
                        { title: "Novios Exigentes", desc: "Buscan una pieza central que refleje su historia de amor y deje a los invitados maravillados.", color: "from-primary/20" },
                        { title: "Padres de Quinceañeras", desc: "Quieren celebrar la transición de niña a mujer con una obra de arte dulce e inolvidable.", color: "from-accent/20" },
                        { title: "Wedding Planners", desc: "Necesitan proveedores de confianza que garanticen puntualidad, calidad y montaje impecable.", color: "from-secondary" }
                    ].map((item, idx) => (
                        <div key={idx} className="group relative">
                            {/* Background Shadow Blob */}
                            <div className={`absolute inset-4 bg-gradient-to-br ${item.color} to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                            <div className="relative bg-white p-10 rounded-[2rem] shadow-sm border border-black/5 hover:border-transparent transition-colors duration-500 h-full overflow-hidden">
                                {/* Top Gradient Line */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-30 group-hover:opacity-100 transition-opacity duration-500" />

                                <h3 className="font-serif text-2xl font-bold mb-4 text-foreground group-hover:translate-x-1 transition-transform duration-300">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed font-light group-hover:text-foreground/80 transition-colors duration-300">{item.desc}</p>

                                {/* Corner decoration */}
                                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
