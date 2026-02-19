"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star, Check } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useCart } from "@/context/cart-context"
import { useState } from "react"
import { cn } from "@/lib/utils"

const products = [
    {
        id: 1,
        name: "Wedding Classic",
        price: 85,
        rating: 5,
        image: "/img/maqueta-matrimonio-1.jpg",
        desc: "3 pisos de elegancia pura con flores de azúcar hechas a mano."
    },
    {
        id: 2,
        name: "Floral Vintage XV",
        price: 65,
        rating: 5,
        image: "/img/maqueta-matrimonio-2.jpg",
        desc: "Tonos pastel y acabados rústicos para una celebración soñada."
    },
    {
        id: 3,
        name: "Semi-Naked Berries",
        price: 45,
        rating: 4.8,
        image: "/img/maqueta-matrimonio-3.jpg",
        desc: "Frescura natural con frutos del bosque y crema de mantequilla ligera."
    },
    {
        id: 4,
        name: "Golden Glamour",
        price: 90,
        rating: 5,
        image: "/img/maqueta-matrimonio-4.jpg",
        desc: "Detalles en pan de oro de 24k y estructura moderna geométrica."
    },
    {
        id: 5,
        name: "Rose Garden",
        price: 58,
        rating: 4.9,
        image: "/img/maqueta-matrimonio-5.jpg",
        desc: "Jardín de rosas comestibles en cascada sobre fondant de seda."
    },
    {
        id: 6,
        name: "Petite Wedding",
        price: 40,
        rating: 5,
        image: "/img/maqueta-matrimonio-6.jpg",
        desc: "Perfecta para bodas civiles íntimas. Diseño minimalista y sabor intenso."
    }
]

export function BestSellers() {
    const { addItem } = useCart()
    // Track which product was just added to show visual feedback
    const [addedId, setAddedId] = useState<number | null>(null)

    const handleAddToCart = (product: any) => {
        addItem(product)
        setAddedId(product.id)
        setTimeout(() => setAddedId(null), 1500)
    }

    return (
        <section className="py-16 md:py-24 bg-secondary/5 relative">
            <div className="container">

                <div className="text-center mb-16 space-y-4">
                    <span className="text-accent uppercase tracking-[0.2em] text-xs font-bold bg-white px-4 py-2 rounded-full border border-accent/20 shadow-sm">
                        Colección 2026
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif text-foreground font-medium">
                        Los Favoritos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic">Nuestras Novias</span>
                    </h2>
                    <p className="max-w-xl mx-auto text-muted-foreground font-light">
                        Descubre las creaciones que han robado corazones y protagonizado los eventos más exclusivos de la temporada.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <div className="group relative h-full">
                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                                <Card className="h-full border-0 bg-white shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col rounded-[2rem]">
                                    <CardHeader className="p-0 relative aspect-[4/5] overflow-hidden bg-secondary/10">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 z-10">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {product.rating}
                                        </div>

                                        {/* Overlay with Quick Action */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                            <Button
                                                variant="outline"
                                                className="bg-white/90 text-foreground border-none rounded-full px-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 font-medium"
                                            >
                                                Vista Rápida
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-6 px-6 flex-grow space-y-3">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-serif font-bold text-xl text-foreground line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                                                <span className="font-bold text-lg text-primary whitespace-nowrap">S/ {product.price}</span>
                                            </div>
                                            <div className="w-12 h-0.5 bg-gradient-to-r from-primary/50 to-transparent rounded-full" />
                                        </div>
                                        <p className="text-muted-foreground text-sm font-light line-clamp-2 leading-relaxed">
                                            {product.desc}
                                        </p>
                                    </CardContent>

                                    <CardFooter className="pb-6 px-6 pt-2">
                                        <Button
                                            className={cn(
                                                "w-full transition-all duration-300 shadow-lg group-hover:shadow-primary/25",
                                                addedId === product.id
                                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                                    : "bg-foreground text-white hover:bg-primary"
                                            )}
                                            size="lg"
                                            onClick={() => handleAddToCart(product)}
                                            disabled={addedId === product.id}
                                        >
                                            {addedId === product.id ? (
                                                <>
                                                    <Check className="mr-2 w-4 h-4" /> Agregado
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="mr-2 w-4 h-4" /> Agregar al Carrito
                                                </>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
