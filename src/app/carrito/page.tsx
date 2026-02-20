"use client"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/sections/navbar"
import { Footer } from "@/components/sections/footer"

export default function CartPage() {
    const { items, removeItem, clearCart, cartTotal } = useCart()

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 animate-fade-in-up">
                    <div className="p-8 bg-secondary/5 rounded-full border border-secondary/10">
                        <ShoppingBag className="w-16 h-16 text-muted-foreground/40" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-serif font-bold text-foreground">Tu carrito está vacío</h1>
                        <p className="text-muted-foreground font-light max-w-md mx-auto">
                            Parece que aún no has elegido tu torta soñada.
                        </p>
                    </div>
                    <Button asChild className="bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/20 transition-all hover:scale-105">
                        <Link href="/#best-sellers">Ver Colección 2026</Link>
                    </Button>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 container max-w-6xl py-12 md:py-16">
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-10 text-center text-foreground tracking-tight">Tu Selección Exclusiva</h1>

                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="group flex gap-5 p-4 rounded-2xl bg-white border border-border/40 shadow-sm hover:shadow-md transition-all items-center relative">
                                    <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-secondary/10 border border-border/20">
                                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <div className="flex justify-between items-start pr-8">
                                            <h3 className="font-serif font-bold text-lg text-foreground line-clamp-1">{item.name}</h3>
                                            <span className="font-bold text-primary text-lg whitespace-nowrap">S/ {item.price}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-light line-clamp-1 max-w-[90%]">{item.desc}</p>

                                        <div className="pt-1 flex items-center gap-4">
                                            <span className="text-xs font-medium text-foreground/70 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">Cant: {item.quantity}</span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-full w-8 h-8 transition-colors"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-8 px-2">
                            <Button variant="ghost" onClick={clearCart} className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 text-sm px-3 font-light hover:underline">
                                Vaciar Carrito
                            </Button>
                            <Link href="/#best-sellers" className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 transition-colors">
                                Seguir Comprando <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-2xl bg-foreground text-white p-8 shadow-2xl shadow-primary/10 relative overflow-hidden ring-1 ring-white/10">
                            {/* Background Gradients */}
                            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-accent/20 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                            <h2 className="text-xl font-serif font-bold mb-6 relative z-10 border-b border-white/10 pb-4">Resumen de Orden</h2>

                            <div className="space-y-3 mb-8 text-white/80 font-light relative z-10 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>S/ {cartTotal}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Envío</span>
                                    <span className="text-[10px] uppercase tracking-wider text-primary bg-white/10 px-2 py-0.5 rounded-full">Por Calcular</span>
                                </div>
                                <div className="h-px bg-white/10 my-3" />
                                <div className="flex justify-between text-xl font-serif font-bold text-white">
                                    <span>Total Estimado</span>
                                    <span>S/ {cartTotal}</span>
                                </div>
                            </div>

                            <Button asChild className="w-full bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-bold h-12 rounded-xl text-base shadow-lg relative z-10 group transition-all hover:scale-[1.02]">
                                <Link href="/checkout">
                                    Proceder al Pago <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>

                            <p className="text-[10px] text-center mt-6 text-white/40 uppercase tracking-widest relative z-10 flex justify-center gap-2 items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Garantía Momcakespe
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
