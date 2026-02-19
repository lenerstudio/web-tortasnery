import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"

export function Offer() {
    return (
        <section className="py-16 md:py-20 relative overflow-hidden bg-foreground"> {/* Using dark burgundy bg */}

            {/* Dynamic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-destructive/20 to-background opacity-50 mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse duration-[5000ms]" />

            <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">

                <div className="space-y-8 max-w-2xl text-center lg:text-left text-white/90">
                    <div className="inline-block px-4 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs tracking-[0.2em] font-medium uppercase text-primary mb-4">
                        Solo para novias comprometidas
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.1]">
                        ¿Indecisa con los sabores? <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic font-light">
                            Vive la Experiencia Nery
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl font-light opacity-80 leading-relaxed max-w-lg mx-auto lg:mx-0">
                        No te conformes con imaginarlo. Agenda tu <strong className="text-white border-b border-primary/50">Degustación Privada</strong> y diseña tu torta junto a nuestra Chef en una sesión exclusiva.
                    </p>

                    <ul className="grid sm:grid-cols-2 gap-4 text-sm font-light opacity-90 mx-auto lg:mx-0 max-w-lg text-left">
                        {[
                            "Prueba 5 combinaciones exclusivas",
                            "Asesoría de diseño personalizada",
                            "Presupuesto detallado al instante",
                            "Bocetos preliminares de tu torta"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-primary to-accent p-1 rounded-full shadow-lg shadow-primary/20 text-foreground">
                                    <Check className="w-3 h-3" strokeWidth={3} />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Card Offer */}
                <div className="relative w-full max-w-md mx-auto lg:mx-0 perspective-1000">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent blur-2xl opacity-40 -z-10 scale-110" />

                    <div className="relative bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl hover:scale-[1.02] transition-transform duration-500 overflow-hidden group">
                        {/* Shine effect */}
                        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-[100%] transition-all duration-1000" />

                        <div className="text-center space-y-8 relative z-10">
                            <span className="block text-xs uppercase tracking-[0.3em] text-white/60 font-semibold border-b border-white/10 pb-4">
                                Reserva tu cita hoy
                            </span>

                            <div className="space-y-0">
                                <div className="text-6xl md:text-7xl font-serif font-medium text-white tracking-tight">
                                    50<span className="text-4xl align-top text-primary">%</span>
                                </div>
                                <div className="text-2xl font-light text-white/90 uppercase tracking-widest">OFF</div>
                                <p className="text-sm text-white/60 mt-2 font-light">en el costo de la degustación</p>
                            </div>

                            <Button asChild size="lg" className="w-full h-14 bg-gradient-to-r from-primary to-accent text-foreground hover:brightness-110 font-bold text-lg rounded-xl shadow-xl shadow-black/20 group-hover:shadow-primary/20 transition-all flex items-center gap-2">
                                <Link href="#contacto">
                                    Solicitar Degustación <ArrowRight className="w-5 h-5 opacity-70" />
                                </Link>
                            </Button>

                            <p className="text-[10px] uppercase tracking-widest text-white/40">*Promoción válida para eventos de 2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
