"use client"

import { Navbar } from "@/components/sections/navbar"
import { Footer } from "@/components/sections/footer"
import { Button } from "@/components/ui/button"
import { Star, Heart, Share2, ShoppingCart, Truck, ShieldCheck, Mail, Facebook, Twitter, Instagram, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getProductBySlug } from "@/app/admin/actions"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const { addItem } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        async function loadProduct() {
            setLoading(true)
            const slug = Array.isArray(params.id) ? params.id[0] : params.id
            if (slug) {
                const res = await getProductBySlug(slug)
                if (res.success) {
                    setProduct(res.data)
                }
            }
            setLoading(false)
        }
        loadProduct()
    }, [params.id])

    if (!mounted) return <div className="min-h-screen bg-background" />;

    const handleAddToCart = () => {
        if (!product) return

        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image_url || "/img/logo.jpg",
            desc: product.description || ""
        }, quantity)
        toast.success("Producto agregado al carrito")
    }

    const handleShare = (platform: string) => {
        const url = window.location.href
        let shareUrl = ""

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
                break
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(product?.name || '')}`
                break
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(`${product?.name} - ${url}`)}`
                break
            default:
                navigator.clipboard.writeText(url)
                toast.success("Enlace copiado al portapapeles")
                return
        }

        if (shareUrl) window.open(shareUrl, '_blank')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <h1 className="text-2xl font-bold">Producto no encontrado</h1>
                    <Button asChild>
                        <a href="/">Volver al inicio</a>
                    </Button>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans" suppressHydrationWarning>
            <Navbar />
            <main className="flex-1 container py-12 md:py-20">

                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                    {/* Product Image */}
                    <div className="relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden bg-secondary/5 border border-secondary/10 shadow-xl">
                        <Image
                            src={product.image_url || "/img/logo.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute top-6 right-6 z-10">
                            <Button size="icon" variant="secondary" className="rounded-full shadow-md bg-white/80 backdrop-blur-sm hover:bg-red-50 hover:text-red-500 transition-colors">
                                <Heart className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col justify-center space-y-8">
                        <Button variant="ghost" className="mb-6 gap-2 pl-0 hover:bg-transparent hover:text-primary" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4" /> Volver
                        </Button>
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                                    {product.category_name || "Exclusivo"}
                                </span>
                                <div className="flex items-center ml-auto text-yellow-500 gap-1 text-sm font-bold">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span>{product.rating || "5.0"}</span>
                                    <span className="text-muted-foreground font-normal">(125 reseñas)</span>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
                                {product.name}
                            </h1>

                            <div className="pricing mb-6">
                                <span className="text-3xl font-bold text-primary">S/ {Number(product.price).toFixed(2)}</span>
                            </div>

                            <p className="text-lg text-muted-foreground leading-relaxed font-light mb-8">
                                {product.description}
                            </p>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-dashed border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-200 rounded-full">
                                    <button
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-l-full"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <button
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-r-full"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <Button size="lg" className="flex-1 rounded-full text-lg h-12 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" onClick={handleAddToCart}>
                                    <ShoppingCart className="w-5 h-5 mr-2" /> Agregar al Carrito
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2 bg-secondary/5 p-3 rounded-xl border border-secondary/10">
                                    <Truck className="w-5 h-5 text-primary" /> Envíos a todo Lima
                                </div>
                                <div className="flex items-center gap-2 bg-secondary/5 p-3 rounded-xl border border-secondary/10">
                                    <ShieldCheck className="w-5 h-5 text-primary" /> Garantía de Calidad
                                </div>
                            </div>

                            <div className="pt-6">
                                <p className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Compartir</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="rounded-full border-blue-100 text-blue-600 hover:bg-blue-50" onClick={() => handleShare('facebook')}>
                                        <Facebook className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full border-sky-100 text-sky-500 hover:bg-sky-50" onClick={() => handleShare('twitter')}>
                                        <Twitter className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full border-green-100 text-green-600 hover:bg-green-50" onClick={() => handleShare('whatsapp')}>
                                        <MessageCircle className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full hover:bg-gray-50" onClick={() => handleShare('copy')}>
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info / Reviews placeholder */}
                <div className="mt-20 lg:mt-32">
                    <div className="border-b border-gray-200 mb-8">
                        <div className="flex gap-8">
                            <button className="pb-4 border-b-2 border-primary font-bold text-primary">Descripción</button>
                            <button className="pb-4 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-800">Valoraciones (125)</button>
                            <button className="pb-4 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-800">Información Nutricional</button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

function MessageCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
    )
}
