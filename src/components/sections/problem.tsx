import { AlertTriangle, CheckCircle2, HeartHandshake, XCircle } from "lucide-react"

export function Problem() {
    return (
        <section className="py-16 md:py-20 bg-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="container grid lg:grid-cols-2 gap-16 items-center">

                <div className="space-y-8 order-2 lg:order-1 relative z-10">
                    <div className="inline-flex items-center gap-2 text-destructive/80 font-bold uppercase tracking-wider text-xs border border-destructive/20 px-3 py-1 rounded-full bg-destructive/5">
                        <AlertTriangle className="h-3 w-3" /> El Riesgo es Real
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif leading-[1.1] text-foreground">
                        ¿Temes que tu torta sea <span className="italic text-muted-foreground/60 line-through decoration-destructive/30 decoration-2">solo una linda foto?</span>
                    </h2>
                    <p className="text-lg text-muted-foreground font-light leading-relaxed">
                        Sabemos que la pesadilla de toda novia es cortar la torta y descubrir un bizcocho seco, artificial o que se desmorona antes de la foto oficial. O peor aún, que llegue tarde.
                    </p>

                    <div className="space-y-4 pt-4">
                        {[
                            "Bizcochos secos y sabores artificiales.",
                            "Diseños genéricos que no reflejan tu estilo.",
                            "Logística improvisada y montaje inseguro."
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-muted/50 hover:bg-destructive/5 hover:border-destructive/20 transition-colors group">
                                <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shrink-0 border border-muted group-hover:border-destructive/30 transition-colors shadow-sm">
                                    <XCircle className="w-5 h-5 text-destructive/60 group-hover:text-destructive transition-colors" />
                                </div>
                                <span className="text-muted-foreground group-hover:text-foreground/80 transition-colors">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="order-1 lg:order-2">
                    <div className="relative bg-gradient-to-br from-[#1f0a0a] to-[#3a1212] rounded-[2.5rem] p-10 md:p-14 shadow-2xl shadow-primary/20 text-white overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                        {/* Shine Effect */}
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="absolute top-0 right-0 p-6 opacity-20">
                            <HeartHandshake className="h-32 w-32 text-white" />
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
                                Solución Tortas Nery
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-3xl font-serif font-medium text-white">
                                    Tu tranquilidad es <br /> nuestra prioridad
                                </h3>
                                <p className="text-white/70 font-light leading-relaxed">
                                    En Tortas Nery, eliminamos la incertidumbre. Garantizamos no solo una escultura comestible, sino una experiencia gastronómica completa.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="bg-green-500/20 p-2 rounded-full">
                                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                                    </div>
                                    <span className="font-serif font-bold text-lg">Garantía de Sabor</span>
                                </div>
                                <p className="text-sm text-white/60 font-light">
                                    Prueba antes de comprar. Nuestra sesión de degustación privada disipará cualquier duda sobre la calidad.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
