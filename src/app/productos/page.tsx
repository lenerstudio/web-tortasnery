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
import { getProducts } from "../admin/actions"
import { useEffect } from "react"
import Link from "next/link"

const categories = ["Todos", "Bodas", "XV Años", "Especiales"]

export default function ProductsPage() {
    const { addItem } = useCart()
    const [mounted, setMounted] = useState(false)
    const [activeCategory, setActiveCategory] = useState("Todos")
    const [addedId, setAddedId] = useState<number | null>(null)
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setMounted(true)
        async function fetchProducts() {
            setLoading(true)
            const res: any = await getProducts()
            if (res.success) {
                // Map DB snake_case to component camelCase or expected names
                const mappedProducts = res.data.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    category: p.category_name || "Otros",
                    price: parseFloat(p.price),
                    rating: parseFloat(p.rating) || 5.0,
                    image: p.image_url || "/img/logo.jpg",
                    desc: p.description || "",
                    slug: p.slug
                }))
                setProducts(mappedProducts)
            }
            setLoading(false)
        }
        fetchProducts()
    }, [])

    if (!mounted) return <div className="min-h-screen bg-background" />;

    const filteredProducts = activeCategory === "Todos"
        ? products
        : products.filter(p => p.category === activeCategory)

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
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <ShoppingCart className="w-12 h-12 text-primary opacity-20" />
                        </motion.div>
                        <p className="text-muted-foreground font-light animate-pulse">Cargando nuestra colección...</p>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => (
                                <motion.div
                                    layout
                                    key={`prod-list-${product.id}`}
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
                                                        asChild
                                                        variant="outline"
                                                        className="bg-white/90 text-foreground border-none rounded-full px-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 font-medium cursor-pointer"
                                                    >
                                                        <Link href={`/productos/${product.slug || product.id}`}>Ver Detalles</Link>
                                                    </Button>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="pt-6 px-6 flex-grow space-y-3">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <Link href={`/productos/${product.slug || product.id}`} className="hover:underline decoration-primary underline-offset-4">
                                                            <h3 className="font-serif font-bold text-xl text-foreground line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                                                        </Link>
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
                )}

                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg font-light">No encontramos productos en esta categoría por el momento.</p>
                    </div>
                )}

            </main>
            <Footer />
        </div>
    )
}
