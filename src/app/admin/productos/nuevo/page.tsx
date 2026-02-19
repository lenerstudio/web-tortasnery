"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Upload, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { createProduct } from "../../actions"
import { toast } from "sonner"

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([])
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        stock: "1"
    })

    useEffect(() => {
        const fetchCats = async () => {
            const { getCategories } = await import("../../actions")
            const res = await getCategories()
            if (res.success) {
                setCategories(res.data as { id: number, name: string }[])
            }
        }
        fetchCats()
    }, [])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = new FormData()
            data.append("name", formData.name)
            data.append("category", formData.category)
            data.append("price", formData.price)
            data.append("description", formData.description)
            data.append("stock", formData.stock)

            const fileInput = document.getElementById('image-input') as HTMLInputElement
            if (fileInput?.files?.[0]) {
                data.append("image", fileInput.files[0])
            }

            const res = await createProduct(data)

            if (res.success) {
                toast.success("¡Producto creado con éxito!")
                router.push("/admin/productos")
            } else {
                toast.error(res.error || "Error al crear producto")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error crítico al procesar el formulario")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-gray-100">
                    <Link href="/admin/productos">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-2xl font-serif font-bold tracking-tight text-gray-900">Nuevo Producto</h2>
                    <p className="text-sm text-gray-500">Añade un nuevo ítem a tu catálogo.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">

                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Información General</CardTitle>
                            <CardDescription>Detalles básicos del producto visible para los clientes.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre del Producto</Label>
                                <Input
                                    id="name"
                                    placeholder="Ej: Torta de Chocolate Premium"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe los ingredientes y el sabor..."
                                    className="min-h-[120px] resize-none"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Inventario y Precios</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Precio (S/)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Disponible</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    required
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Image Upload */}
                    <Card className="border-gray-200 shadow-sm overflow-hidden">
                        <CardHeader>
                            <CardTitle>Imagen del Producto</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl aspect-square flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden group">
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <p className="text-white text-xs font-medium">Cambiar Imagen</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <p className="text-xs text-gray-500">Click para subir</p>
                                        <p className="text-[10px] text-gray-400 mt-1">PNG, JPG hasta 5MB</p>
                                    </>
                                )}
                                <input
                                    id="image-input"
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Categoría</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="category">Seleccionar Categoría</Label>
                                <select
                                    id="category"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="" disabled>Selecciona una opción...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" /> Publicar Producto
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
