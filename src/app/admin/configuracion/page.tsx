"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Save, Loader2, Database, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { getStoreSettings, updateStoreSettings, setupDatabase, seedMockData } from "../actions"

export default function SettingsPage() {
    const [loading, setLoading] = useState(false)
    const [dbLoading, setDbLoading] = useState(false)
    const [formData, setFormData] = useState({
        store_name: "",
        contact_email: "",
        contact_phone: "",
        address: ""
    })
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState("")

    useEffect(() => {
        loadSettings()
    }, [])

    async function loadSettings() {
        const res: any = await getStoreSettings()
        if (res.success && res.data) {
            setFormData({
                store_name: res.data.store_name || "",
                contact_email: res.data.contact_email || "",
                contact_phone: res.data.contact_phone || "",
                address: res.data.address || ""
            })
            if (res.data.logo) setLogoPreview(res.data.logo)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const data = new FormData()
        Object.entries(formData).forEach(([key, value]) => data.append(key, value))
        if (logoFile) data.append("logo", logoFile)

        const res = await updateStoreSettings(data)
        if (res.success) {
            alert("Configuración actualizada correctamente")
        } else {
            alert("Error al guardar")
        }
        setLoading(false)
    }

    const handleSetupDB = async () => {
        if (!confirm("Esto creará las tablas necesarias si no existen. ¿Continuar?")) return
        setDbLoading(true)
        const res = await setupDatabase()
        if (res.success) alert("Base de datos inicializada correctamente.")
        else alert("Error al inicializar BD.")
        setDbLoading(false)
    }

    const handleSeedData = async () => {
        if (!confirm("Esto insertará datos de prueba (pedidos falsos) en la base de datos. ¿Continuar?")) return
        setDbLoading(true)
        const res = await seedMockData()
        if (res.success) alert("Datos de prueba generados. Revisa el Dashboard.")
        else alert("Error al generar datos.")
        setDbLoading(false)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Configuración</h2>
                <p className="text-gray-500">Administra los detalles de tu tienda y la base de datos.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* General Settings */}
                <Card className="md:col-span-2 border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Datos de la Tienda</CardTitle>
                        <CardDescription>Información visible en correos y contacto.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="store_name">Nombre de la Tienda</Label>
                                    <Input
                                        id="store_name"
                                        value={formData.store_name}
                                        onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_phone">Teléfono / WhatsApp</Label>
                                    <Input
                                        id="contact_phone"
                                        value={formData.contact_phone}
                                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_email">Email de Contacto</Label>
                                    <Input
                                        id="contact_email"
                                        type="email"
                                        value={formData.contact_email}
                                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="logo">Logo de la Tienda</Label>
                                    <div className="flex items-center gap-4">
                                        {logoPreview && (
                                            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                                                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    setLogoFile(file)
                                                    setLogoPreview(URL.createObjectURL(file))
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
                                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Guardar Cambios
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Database Tools */}
                <Card className="border-gray-200 shadow-sm md:col-span-2 bg-slate-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5" /> Herramientas de Sistema
                        </CardTitle>
                        <CardDescription>Utilidades para mantenimiento de la base de datos.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                        <Button variant="outline" onClick={handleSetupDB} disabled={dbLoading} className="bg-white">
                            {dbLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                            Inicializar Tablas (Setup)
                        </Button>
                        <Button variant="outline" onClick={handleSeedData} disabled={dbLoading} className="bg-white border-dashed border-gray-400">
                            Simular Datos (Seed)
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
