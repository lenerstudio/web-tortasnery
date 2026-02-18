import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function Hero() {
    return (
        <section id="hero" className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden pt-10 pb-20 md:pt-10 md:pb-32">
            {/* Elegant Gradient Background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary via-background to-background opacity-80" />

            {/* Decorative Blur Orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl opacity-50" />

            <div className="container flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10">

                {/* Content */}
                <div className="flex-1 space-y-8 text-center lg:text-left animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-foreground tracking-wider uppercase shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Tortas de Bodas y XV Años Premium
                    </div>

                    <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight text-foreground drop-shadow-sm">
                        Arte comestible <br /> diseñado para <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent relative inline-block">
                            perdurar
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </span>
                        {" "}en la memoria.
                    </h1>

                    <p className="text-lg md:text-xl font-light text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        Fusionamos la alta pastelería con el diseño floral exclusivo. Convertimos tu visión en el centro de atención de tu celebración.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-6">
                        <Button asChild size="lg" className="h-14 rounded-full px-10 text-lg font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-primary to-accent border-none text-white">
                            <Link href="#contacto">Agendar Degustación</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-14 rounded-full px-10 text-lg font-medium border-primary/30 hover:bg-secondary/50 hover:text-foreground hover:border-primary/60 transition-all bg-white/60 backdrop-blur-md">
                            <Link href="#galeria">Ver Galería</Link>
                        </Button>
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 opacity-90">
                        <div className="flex -space-x-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-12 w-12 rounded-full border-2 border-white bg-secondary overflow-hidden shadow-sm relative">
                                    <Image
                                        src={`/img/${i === 1 ? '490091551_1194553782676549_7488877713644513055_n.jpg' : i === 2 ? '530409252_1296272965837963_1907930321176855560_n.jpg' : '541546709_18065612933195621_1113493324468824701_n.jpg'}`}
                                        alt="Cliente feliz"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="text-sm font-medium">
                            <div className="flex text-accent drop-shadow-sm">
                                {"★".repeat(5)}
                            </div>
                            <p className="text-foreground/80 font-light">Elegido por <span className="font-semibold text-foreground">500+ novias</span></p>
                        </div>
                    </div>
                </div>

                {/* Visual - Using actual image with elegant border */}
                <div className="flex-1 relative w-full h-[500px] md:h-[650px] lg:h-[750px] flex items-center justify-center">
                    <div className="relative w-[90%] h-[90%] rounded-t-full rounded-b-[3rem] overflow-hidden shadow-2xl shadow-primary/10 border-[8px] border-white z-10 animate-fade-in-up delay-200">
                        <Image
                            src="/img/494697095_1212952257503368_3072608485761493813_n.jpg"
                            alt="Torta de Boda Premium"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-1000"
                            priority
                        />
                    </div>

                    {/* Background decorative elements behind image */}
                    <div className="absolute top-10 right-0 w-64 h-64 bg-accent/10 rounded-full blur-2xl -z-10" />
                    <div className="absolute bottom-10 left-0 w-56 h-56 bg-primary/10 rounded-full blur-2xl -z-10" />

                    {/* Floating badge */}
                    <div className="absolute bottom-20 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 animate-bounce delay-1000 duration-[3000ms]">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full text-green-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Disponible</p>
                                <p className="font-serif font-bold text-foreground">Agenda 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
