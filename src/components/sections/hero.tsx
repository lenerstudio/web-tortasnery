"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRef } from "react"

export function Hero() {
    const ref = useRef(null)

    return (
        <section id="hero" ref={ref} className="relative isolate flex min-h-[auto] md:h-screen md:max-h-screen flex-col items-center justify-center overflow-hidden pt-24 pb-12 md:pt-0 md:pb-0">

            {/* Animated Dynamic Background - z-0 so it's visible above parent bg */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Base background color */}
                <div className="absolute inset-0 bg-background" />

                {/* Background Image with Ken Burns zoom */}
                <motion.div
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-[-5%]"
                >
                    <Image
                        src="/img/maqueta-matrimonio-5.jpg"
                        alt="Fondo Elegante"
                        fill
                        className="object-cover opacity-50"
                        priority
                    />
                </motion.div>

                {/* Animated Gradient Blobs - large and vibrant */}
                <motion.div
                    animate={{ x: [0, 40, -30, 0], y: [0, -50, 30, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[15%] -right-[5%] w-[700px] h-[700px] rounded-full bg-primary/40 blur-[130px]"
                />
                <motion.div
                    animate={{ x: [0, -40, 30, 0], y: [0, 40, -30, 0] }}
                    transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[15%] -left-[5%] w-[600px] h-[600px] rounded-full bg-accent/35 blur-[110px]"
                />
                <motion.div
                    animate={{ x: [0, 25, -35, 0], y: [0, -25, 35, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[25%] left-[35%] w-[500px] h-[500px] rounded-full bg-secondary/50 blur-[90px]"
                />

                {/* Soft gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/50" />
            </div>

            <motion.div className="container flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10">
                {/* Content */}
                <div className="flex-1 space-y-8 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-foreground tracking-wider uppercase shadow-sm hover:bg-white/80 transition-colors cursor-default"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Tortas de Bodas y XV Años Premium
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight text-foreground drop-shadow-sm"
                    >
                        Arte comestible <br /> diseñado para <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent relative inline-block">
                            perdurar
                            <motion.svg
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, delay: 1 }}
                                className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-40"
                                viewBox="0 0 100 10"
                                preserveAspectRatio="none"
                            >
                                <motion.path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                            </motion.svg>
                        </span>
                        {" "}en la memoria.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl font-light text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                    >
                        Fusionamos la alta pastelería con el diseño floral exclusivo. Convertimos tu visión en el centro de atención de tu celebración.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-6"
                    >
                        <Button asChild size="lg" className="h-14 rounded-full px-10 text-lg font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-primary to-accent border-none text-white overflow-hidden relative group">
                            <Link href="#contacto">
                                <span className="relative z-10">Agendar Degustación</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-14 rounded-full px-10 text-lg font-medium border-primary/30 hover:bg-secondary/50 hover:text-foreground hover:border-primary/60 transition-all bg-white/60 backdrop-blur-md">
                            <Link href="#galeria">Ver Galería</Link>
                        </Button>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="flex items-center justify-center lg:justify-start gap-4 pt-4 opacity-90"
                    >
                        <div className="flex -space-x-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-12 w-12 rounded-full border-2 border-white bg-secondary overflow-hidden shadow-sm relative hover:z-10 hover:scale-110 transition-transform duration-300">
                                    <Image
                                        src={`/img/${i === 1 ? 'novia-1.avif' : i === 2 ? 'novia-2.avif' : 'novia-3.avif'}`}
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
                            <p className="text-foreground/80 font-light">Elegido por <span className="font-semibold text-foreground">+500 novias</span></p>
                        </div>
                    </motion.div>
                </div>

                {/* Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="flex-1 relative w-full h-[400px] md:h-[50vh] lg:h-[70vh] flex items-center justify-center"
                >
                    <div className="relative w-[90%] h-[130%] rounded-t-full rounded-b-[3rem] overflow-hidden shadow-2xl shadow-primary/10 border-[8px] border-pink z-10 group">
                        <Image
                            src="/img/hero-torta.jpg"
                            alt="Torta de Boda Premium"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            style={{ transitionDuration: '2000ms' }}
                            priority
                        />
                        {/* Shine overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    </div>

                    {/* Floating badge */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="hidden md:block absolute bottom-20 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 z-20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full text-green-600 animate-pulse">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Disponible</p>
                                <p className="font-serif font-bold text-foreground">Agenda 2026</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    )
}
