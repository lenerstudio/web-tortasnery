"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Pencil, Trash2, Loader2, Star, StarOff } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
// @ts-ignore
import { toast } from "sonner"

import { getProducts, deleteProduct, toggleFeaturedProduct } from "../actions"

export default function ProductsAdminPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadProducts()
    }, [])

    async function loadProducts() {
        setLoading(true)
        const res: any = await getProducts()
        if (res.success) {
            setProducts(res.data)
        }
        setLoading(false)
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category_name && product.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            const res = await deleteProduct(id)
            if (res.success) {
                toast.success("Producto eliminado")
                loadProducts()
            } else {
                toast.error("Error al eliminar")
            }
        }
    }

    const handleToggleFeatured = async (id: number, currentStatus: boolean) => {
        const res = await toggleFeaturedProduct(id, !currentStatus)
        if (res.success) {
            toast.success(currentStatus ? "Removido de destacados" : "Añadido a destacados")
            loadProducts()
        } else {
            toast.error(res.error || "No se pudo actualizar")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Productos</h2>
                    <p className="text-gray-500">Gestiona el catálogo de tu pastelería.</p>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all">
                    <Link href="/admin/productos/nuevo">
                        <Plus className="w-4 h-4 mr-2" /> Nuevo Producto
                    </Link>
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Buscar producto..."
                        className="pl-9 border-gray-200 focus:border-primary/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 ml-auto text-sm text-gray-500">
                    <span className="font-medium text-gray-900">{filteredProducts.length}</span> resultados
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Producto</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4">Precio</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-center">En Landing</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 relative min-h-[100px]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                            <p className="text-gray-500 text-sm">Cargando productos...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                <Image src={product.image_url || "/img/logo.jpg"} alt={product.name} fill className="object-cover" />
                                            </div>
                                            <span className="font-serif font-bold text-gray-900 group-hover:text-primary transition-colors">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {product.category_name || "Sin categoría"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">S/ {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</td>
                                    <td className="px-6 py-4 text-gray-600">{product.stock} un.</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                                                className={product.is_featured ? "text-yellow-500 hover:text-yellow-600 bg-yellow-50" : "text-gray-300 hover:text-yellow-500"}
                                            >
                                                {product.is_featured ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}>
                                            {product.stock > 0 ? "Activo" : "Agotado"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary hover:bg-primary/10">
                                                <Link href={`/admin/productos/${product.id}`}>
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No se encontraron productos.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
