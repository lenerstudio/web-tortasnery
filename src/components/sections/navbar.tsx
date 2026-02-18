"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

const navigation = [
    { name: "Inicio", href: "#hero" },
    { name: "Bodas", href: "#servicios" },
    { name: "XV Años", href: "#servicios" },
    { name: "Galería", href: "#galeria" },
    { name: "Testimonios", href: "#testimonios" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Logo Text/Image */}
                    <Link href="/" className="group flex items-center space-x-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary/20 shadow-sm group-hover:border-primary transition-colors">
                            <Image src="/img/logo.jpg" alt="Tortas Nery Logo" fill className="object-cover" />
                        </div>
                        <span className="text-xl font-serif font-bold text-foreground tracking-wide group-hover:text-primary transition-colors">Tortas Nery</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:gap-6">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium transition-colors hover:text-primary"
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Button asChild variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link href="#contacto">Agendar Degustación</Link>
                    </Button>
                </div>

                {/* Mobile Navigation */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                        <nav className="flex flex-col gap-4 mt-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-lg font-medium hover:text-primary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Button asChild className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                <Link href="#contacto" onClick={() => setIsOpen(false)}>Agendar Degustación</Link>
                            </Button>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    )
}
