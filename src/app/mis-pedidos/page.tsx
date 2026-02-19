"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/sections/navbar"
import { Footer } from "@/components/sections/footer"
import { getAdminSession, getUserOrders, getOrderById } from "@/app/admin/actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, Calendar, MapPin, Eye, ShoppingBag } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [detailsLoading, setDetailsLoading] = useState(false)

    useEffect(() => {
        async function loadData() {
            const session = await getAdminSession()
            if (session) {
                setUser(session)
                const res = await getUserOrders(session.email as string)
                if (res.success) {
                    setOrders(res.data)
                }
            }
            setLoading(false)
        }
        loadData()
    }, [])

    async function handleViewDetails(id: number) {
        setDetailsLoading(true)
        setIsDetailsOpen(true)
        const res = await getOrderById(id)
        if (res.success) {
            setSelectedOrder(res.data)
        }
        setDetailsLoading(false)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "bg-green-100 text-green-700 border-green-200"
            case "processing": return "bg-blue-100 text-blue-700 border-blue-200"
            case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200"
            case "cancelled": return "bg-red-100 text-red-700 border-red-200"
            default: return "bg-gray-100 text-gray-700 border-gray-200"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "completed": return "Entregado"
            case "processing": return "En Preparación"
            case "pending": return "Pendiente"
            case "cancelled": return "Cancelado"
            default: return status
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 container max-w-5xl py-12 md:py-20">
                <div className="space-y-2 mb-10">
                    <h1 className="text-4xl font-serif font-bold text-foreground">Mis Pedidos</h1>
                    <p className="text-muted-foreground font-light text-lg">Historial de tus momentos dulces con nosotros.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary/40 mb-4" />
                        <p className="text-muted-foreground animate-pulse">Cargando tus pedidos...</p>
                    </div>
                ) : !user ? (
                    <Card className="border-dashed border-2 bg-secondary/5 text-center p-12 rounded-[2rem]">
                        <CardContent className="space-y-6">
                            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                                <Package className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-serif font-bold">Inicia Sesión</h2>
                                <p className="text-muted-foreground max-w-xs mx-auto">Debes estar logueado para ver tu historial de pedidos.</p>
                            </div>
                            <Button asChild className="rounded-full px-8 bg-primary">
                                <Link href="/login?redirect=/mis-pedidos">Entrar a mi Cuenta</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : orders.length === 0 ? (
                    <Card className="border-dashed border-2 bg-secondary/5 text-center p-12 rounded-[2rem]">
                        <CardContent className="space-y-6">
                            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                                <ShoppingBag className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-serif font-bold">Aún no tienes pedidos</h2>
                                <p className="text-muted-foreground max-w-xs mx-auto">¿Qué tal si empezamos con algo dulce hoy?</p>
                            </div>
                            <Button asChild className="rounded-full px-8 bg-primary">
                                <Link href="/productos">Ver Productos</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => (
                            <Card key={order.id} className="group hover:shadow-xl hover:shadow-black/5 transition-all duration-300 border-border/40 overflow-hidden rounded-2xl">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Status Sidebar (Desktop) */}
                                        <div className={cn("w-2 md:w-3 shrink-0",
                                            order.status === 'completed' ? 'bg-green-500' :
                                                order.status === 'cancelled' ? 'bg-red-500' :
                                                    order.status === 'processing' ? 'bg-blue-500' : 'bg-yellow-500'
                                        )} />

                                        <div className="p-6 md:p-8 flex-1 grid md:grid-cols-4 gap-6 items-center">
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Pedido</p>
                                                <p className="font-serif font-bold text-xl text-primary">#{order.order_number}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Estado</p>
                                                <div className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border", getStatusColor(order.status))}>
                                                    {getStatusLabel(order.status)}
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total</p>
                                                <p className="font-bold text-lg">S/ {parseFloat(order.total_amount).toFixed(2)}</p>
                                            </div>

                                            <div className="flex md:justify-end">
                                                <Button
                                                    variant="outline"
                                                    className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white transition-all group-hover:scale-105"
                                                    onClick={() => handleViewDetails(order.id)}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" /> Detalles
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Details Modal */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-[2rem] overflow-hidden p-0">
                    <div className="bg-primary/5 p-8 border-b border-border/40">
                        <DialogHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <DialogTitle className="font-serif text-3xl font-bold text-primary">Detalle del Pedido</DialogTitle>
                                    <DialogDescription className="text-lg">Orden #{selectedOrder?.order_number}</DialogDescription>
                                </div>
                                <div className={cn("px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm", selectedOrder ? getStatusColor(selectedOrder.status) : "")}>
                                    {selectedOrder ? getStatusLabel(selectedOrder.status) : ""}
                                </div>
                            </div>
                        </DialogHeader>
                    </div>

                    <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {detailsLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                            </div>
                        ) : selectedOrder && (
                            <>
                                {/* Event Info */}
                                <div className="grid grid-cols-2 gap-6 bg-secondary/5 p-4 rounded-2xl border border-secondary/10">
                                    <div className="flex gap-3">
                                        <Calendar className="w-5 h-5 text-primary shrink-0" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Fecha</p>
                                            <p className="text-sm font-medium">{new Date(selectedOrder.event_date).toLocaleDateString()}</p>
                                            <p className="text-xs text-muted-foreground">{selectedOrder.event_time}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <MapPin className="w-5 h-5 text-primary shrink-0" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Entrega</p>
                                            <p className="text-sm font-medium line-clamp-2">{selectedOrder.delivery_address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-4">
                                    <h4 className="font-serif font-bold text-xl border-b pb-2">Productos</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map((item: any) => (
                                            <div key={item.id} className="flex justify-between items-center py-2 border-b border-dashed border-border last:border-0">
                                                <div>
                                                    <p className="font-bold text-foreground">{item.product_name}</p>
                                                    <p className="text-xs text-muted-foreground">{item.quantity} x S/ {parseFloat(item.unit_price).toFixed(2)}</p>
                                                </div>
                                                <p className="font-bold text-primary text-lg">S/ {parseFloat(item.subtotal).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="pt-4 border-t-2 border-primary/10">
                                    <div className="flex justify-between items-center">
                                        <span className="font-serif font-bold text-2xl text-foreground">Total Pagado</span>
                                        <span className="font-serif font-bold text-3xl text-primary">S/ {parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                                    </div>
                                </div>

                                {selectedOrder.notes && (
                                    <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 text-sm">
                                        <p className="text-[10px] uppercase font-bold text-yellow-800/60 mb-1">Notas</p>
                                        <p className="italic text-yellow-800">"{selectedOrder.notes}"</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    )
}
