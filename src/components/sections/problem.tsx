import { AlertTriangle, CheckCircle2, HeartHandshake } from "lucide-react"

export function Problem() {
    return (
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
            <div className="container grid md:grid-cols-2 gap-16 items-center">

                <div className="space-y-8 order-2 md:order-1">
                    <div className="inline-flex items-center gap-2 text-destructive font-medium uppercase tracking-wider text-sm">
                        <AlertTriangle className="h-4 w-4" /> El dilema común
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                        ¿Temes que tu torta sea <span className="italic text-muted-foreground line-through decoration-destructive/50">solo una linda foto?</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Sabemos que la pesadilla de toda novia es cortar la torta y descubrir un bizcocho seco, artificial o que se desmorona antes de la foto oficial. O peor aún, que llegue tarde y dañada.
                    </p>

                    <ul className="space-y-4">
                        {[
                            "Bizcochos secos y sabores artificiales.",
                            "Diseños genéricos que no reflejan tu estilo.",
                            "Estrés por la logística y el montaje inseguro."
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                <div className="h-6 w-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                                    <span className="text-xs font-bold">✕</span>
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="order-1 md:order-2 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-10 border border-border/50 shadow-lg relative">
                    <div className="absolute top-0 right-0 p-4 bg-background rounded-bl-3xl border-b border-l border-border/50">
                        <HeartHandshake className="h-8 w-8 text-primary" />
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-secondary-foreground mb-6">
                        Tu tranquilidad es nuestra prioridad
                    </h3>
                    <p className="text-muted-foreground mb-8">
                        En Tortas Nery, eliminamos la incertidumbre. Garantizamos no solo una escultura comestible, sino una experiencia gastronómica.
                    </p>

                    <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-primary/20">
                        <div className="flex items-center gap-4 mb-2">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                            <span className="font-bold text-foreground">Garantía de Sabor</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Prueba antes de comprar. Nuestra sesión de degustación privada te convencerá.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
