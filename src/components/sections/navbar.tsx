"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import Image from "next/image"
import { useCart } from "@/context/cart-context"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
    { name: "Inicio", href: "/#hero" },
    { name: "Bodas", href: "/#servicios" },
    { name: "Productos", href: "/productos" },
    { name: "Testimonios", href: "/#testimonios" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const { cartCount } = useCart()

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">

                {/* Logo */}
                <Link href="/" className="group flex items-center space-x-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary/20 shadow-sm group-hover:border-primary transition-colors">
                        <Image src="/img/logo.jpg" alt="Tortas Nery Logo" fill className="object-cover" />
                    </div>
                    <span className="text-xl font-serif font-bold text-primary tracking-wide group-hover:text-primary transition-colors">Tortas Nery</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:gap-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium transition-colors hover:text-primary relative group"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}

                    {/* Cart Icon */}
                    <Link href="/carrito" className="relative group">
                        <div className="p-2 rounded-full hover:bg-muted transition-colors">
                            <ShoppingBag className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-background"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </Link>

                    <Button asChild variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-full px-6">
                        <Link href="/#contacto">Agendar Llamada</Link>
                    </Button>
                </div>

                {/* Mobile Navigation */}
                <div className="flex items-center gap-4 md:hidden">
                    {/* Mobile Cart */}
                    <Link href="/carrito" className="relative">
                        <ShoppingBag className="w-6 h-6 text-foreground" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-background">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <SheetHeader>
                                <SheetTitle className="text-left font-serif font-bold text-2xl">Menú</SheetTitle>
                                <SheetDescription className="sr-only">Navegación principal</SheetDescription>
                            </SheetHeader>
                            <nav className="flex flex-col gap-4 mt-8">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-lg font-medium hover:text-primary border-b border-border/50 pb-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <Button asChild className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Link href="tel:+51997935991">Agendar Llamada</Link>
                                </Button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}
