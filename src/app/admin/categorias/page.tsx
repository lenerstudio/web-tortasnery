"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/app/admin/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Category {
    id: number
    name: string
    slug: string
    created_at: string
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    // Form data
    const [formData, setFormData] = useState({
        name: "",
        slug: ""
    })

    const fetchCategories = async () => {
        setLoading(true)
        const res: any = await getCategories()
        if (res.success) {
            setCategories(res.data)
        } else {
            toast.error(res.error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleOpenAdd = () => {
        setEditingCategory(null)
        setFormData({ name: "", slug: "" })
        setIsDialogOpen(true)
    }

    const handleOpenEdit = (category: Category) => {
        setEditingCategory(category)
        setFormData({ name: category.name, slug: category.slug })
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const data = new FormData()
        data.append("name", formData.name)
        data.append("slug", formData.slug)

        let res: any
        if (editingCategory) {
            res = await updateCategory(editingCategory.id, data)
        } else {
            res = await createCategory(data)
        }

        if (res.success) {
            toast.success(editingCategory ? "Categoría actualizada" : "Categoría creada")
            setIsDialogOpen(false)
            fetchCategories()
        } else {
            toast.error(res.error)
        }
        setIsSubmitting(false)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar esta categoría?")) return

        setIsDeleting(id)
        const res: any = await deleteCategory(id)
        if (res.success) {
            toast.success("Categoría eliminada")
            fetchCategories()
        } else {
            toast.error(res.error)
        }
        setIsDeleting(null)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Categorías</h1>
                    <p className="text-gray-500 mt-1">Organiza tus productos por tipos para facilitar la navegación.</p>
                </div>
                <Button onClick={handleOpenAdd} className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 gap-2 h-11 transition-all hover:scale-105 active:scale-95">
                    <Plus className="w-5 h-5" />
                    Nueva Categoría
                </Button>
            </div>

            {/* Content Card */}
            <Card className="border-gray-200/60 shadow-xl shadow-gray-200/20 rounded-2xl overflow-hidden bg-white">
                <CardHeader className="border-b border-gray-100 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Buscar categorías..."
                                className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-all rounded-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-sm text-gray-400 font-medium">
                            {filteredCategories.length} categorías en total
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100 uppercase text-[10px] tracking-widest font-bold text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Nombre</th>
                                    <th className="px-6 py-4">Slug (URL)</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                                                <span className="text-sm text-gray-400">Cargando categorías...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <div className="text-gray-400">No se encontraron categorías.</div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCategories.map((cat) => (
                                        <tr key={cat.id} className="group hover:bg-gray-50/80 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-400">#{cat.id}</td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-gray-900">{cat.name}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="text-[11px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-mono">
                                                    {cat.slug}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleOpenEdit(cat)}
                                                        className="h-8 w-8 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(cat.id)}
                                                        disabled={isDeleting === cat.id}
                                                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                                    >
                                                        {isDeleting === cat.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl border-gray-200">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-serif font-bold text-gray-900">
                            {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? "Modifica los detalles de la categoría existente."
                                : "Crea una nueva categoría para organizar tus productos."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nombre de la Categoría</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                        slug: editingCategory ? formData.slug : e.target.value.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                                    })
                                }}
                                placeholder="Ej: Bodas, XV Años..."
                                required
                                className="h-11 bg-gray-50 border-gray-200 focus:bg-white rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-sm font-semibold text-gray-700">Slug (URL)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono">/productos/</span>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                    placeholder="ej-categoria"
                                    required
                                    className="pl-24 h-11 bg-gray-50 border-gray-200 focus:bg-white rounded-xl font-mono text-xs"
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4 border-t border-gray-100 flex-col sm:flex-row gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 shadow-lg shadow-primary/20 min-w-[120px]">
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : editingCategory ? "Actualizar" : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
