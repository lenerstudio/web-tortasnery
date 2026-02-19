"use client"

import { useState } from "react"
import { Navbar } from "@/components/sections/navbar"
import { Footer } from "@/components/sections/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ShoppingCart, Star, Check, Filter } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/context/cart-context"
import { cn } from "@/lib/utils"

// Product Data with Categories
const allProducts = [
    // Bodas
    {
        id: 1,
        name: "Wedding Classic",
        category: "Bodas",
        price: 85,
        rating: 5,
        image: "/img/maqueta-matrimonio-1.jpg",
        desc: "3 pisos de elegancia pura con flores de azúcar hechas a mano."
    },
    {
        id: 4,
        name: "Golden Glamour",
        category: "Bodas",
        price: 90,
        rating: 5,
        image: "/img/maqueta-matrimonio-4.jpg",
        desc: "Detalles en pan de oro de 24k y estructura moderna geométrica."
    },
    {
        id: 5,
        name: "Rose Garden",
        category: "Bodas",
        price: 58,
        rating: 4.9,
        image: "/img/maqueta-matrimonio-5.jpg",
        desc: "Jardín de rosas comestibles en cascada sobre fondant de seda."
    },
    {
        id: 6,
        name: "Petite Wedding",
        category: "Bodas",
        price: 40,
        rating: 5,
        image: "/img/maqueta-matrimonio-6.jpg",
        desc: "Perfecta para bodas civiles íntimas. Diseño minimalista y sabor intenso."
    },
    // XV Años
    {
        id: 2,
        name: "Floral Vintage XV",
        category: "XV Años",
        price: 65,
        rating: 5,
        image: "/img/maqueta-matrimonio-2.jpg",
        desc: "Tonos pastel y acabados rústicos para una celebración soñada."
    },
    {
        id: 7,
        name: "Princess Dream",
        category: "XV Años",
        price: 75,
        rating: 4.8,
        image: "/img/587858529_18075134909195621_1845515962150067974_n.jpg", // Using one of the other images
        desc: "Una fantasía rosa con detalles en encaje comestible y perlas."
    },
    {
        id: 8,
        name: "Modern Chic",
        category: "XV Años",
        price: 80,
        rating: 5,
        image: "/img/612417813_18078818981195621_3662944675043263858_n.jpg",
        desc: "Diseño contemporáneo con efectos marmoleados y toques metálicos."
    },
    // Especiales / Otros
    {
        id: 3,
        name: "Semi-Naked Berries",
        category: "Especiales",
        price: 45,
        rating: 4.8,
        image: "/img/maqueta-matrimonio-3.jpg",
        desc: "Frescura natural con frutos del bosque y crema de mantequilla ligera."
    },
    {
        id: 9,
        name: "Chocolate Indulgence",
        category: "Especiales",
        price: 55,
        rating: 4.9,
        image: "/img/541930916_18066096230195621_2081483075660401590_n.jpg",
        desc: "Para los amantes del cacao, con ganache rico y trufas artesanales."
    }
]

const categories = ["Todos", "Bodas", "XV Años", "Especiales"]

export default function ProductsPage() {
    const { addItem } = useCart()
    const [activeCategory, setActiveCategory] = useState("Todos")
    const [addedId, setAddedId] = useState<number | null>(null)

    const filteredProducts = activeCategory === "Todos"
        ? allProducts
        : allProducts.filter(p => p.category === activeCategory)

    const handleAddToCart = (product: any) => {
        addItem(product)
        setAddedId(product.id)
        setTimeout(() => setAddedId(null), 1500)
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />

            {/* Header Section */}
            <div className="bg-foreground text-white py-20 relative overflow-hidden">
                <div className="container relative z-10 text-center space-y-4">
                    <span className="text-secondary font-bold text-xs uppercase tracking-[0.3em] opacity-80 inline-block">Galería de Sabores</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-medium">Nuestra Colección</h1>
                    <p className="max-w-2xl mx-auto text-white/60 font-light text-lg">
                        Cada torta es una obra maestra diseñada para ser el centro de atención de tu celebración.
                    </p>
                </div>
                {/* Abstract Background */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent rounded-full blur-[120px]" />
                </div>
            </div>

            <main className="flex-1 container py-16">

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                                activeCategory === cat
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                                    : "bg-white text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <motion.div
                    layout
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <motion.div
                                layout
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="group relative h-full">
                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

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

                                            {/* Category Badge */}
                                            <div className="absolute top-4 left-4 bg-secondary/90 backdrop-blur-sm text-secondary-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm z-10">
                                                {product.category}
                                            </div>

                                            {/* Overlay with Quick Action */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                                <Button
                                                    variant="outline"
                                                    className="bg-white/90 text-foreground border-none rounded-full px-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 font-medium"
                                                >
                                                    Ver Detalles
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
                    </AnimatePresence>
                </motion.div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg font-light">No encontramos productos en esta categoría por el momento.</p>
                    </div>
                )}

            </main>
            <Footer />
        </div>
    )
}
