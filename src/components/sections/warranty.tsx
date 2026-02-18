import { ShieldCheck, Truck, Sparkles } from "lucide-react"

export function Warranty() {
    return (
        <section className="py-24 bg-muted/40 relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="container relative text-center max-w-6xl space-y-16">
                <div className="space-y-4">
                    <span className="text-secondary-foreground font-bold text-xs tracking-[0.3em] uppercase opacity-60">Compromiso de Calidad</span>
                    <h2 className="text-3xl md:text-5xl font-serif font-medium text-foreground tracking-tight">
                        Nuestra Promesa: <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent relative inline-block">Tu Tranquilidad</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 text-left">
                    {[
                        {
                            icon: <ShieldCheck className="w-8 h-8 text-primary" />,
                            title: "Satisfacción Garantizada",
                            text: "Si la propuesta de diseño o sabor en la degustación no supera tus expectativas, te reembolsamos el costo de la sesión sin preguntas."
                        },
                        {
                            icon: <Truck className="w-8 h-8 text-accent" />,
                            title: "Puntualidad por Contrato",
                            text: "Tu torta estará montada y perfecta 2 horas antes de que llegue el primer invitado. Si no, te bonificamos el 50% del valor del servicio."
                        },
                        {
                            icon: <Sparkles className="w-8 h-8 text-primary" />,
                            title: "Blindaje ante Percances",
                            text: "Viajamos con un 'Kit de Emergencia' que incluye réplicas de flores y decoraciones para reparar cualquier daño imprevisto al instante."
                        }
                    ].map((item, i) => (
                        <div key={i} className="group relative bg-white p-8 rounded-[1.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-primary/5">
                            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-muted/50 mb-6 group-hover:bg-primary/10 transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="font-serif font-bold text-xl mb-4 text-foreground">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm font-light">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
