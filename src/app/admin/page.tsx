"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Package, ShoppingBag, Loader2, RefreshCcw } from "lucide-react"
import { getDashboardStats, setupDatabase, getRecentOrders } from "./actions"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
    const [statsData, setStatsData] = useState({
        sales: 0,
        pendingOrders: 0,
        products: 0,
        customers: 0
    })
    const [recentOrders, setRecentOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshSignal, setRefreshSignal] = useState(0)

    useEffect(() => {
        async function loadData(showLoading = true) {
            if (showLoading) setLoading(true)
            const stats: any = await getDashboardStats()
            const ordersRes: any = await getRecentOrders(6)

            setStatsData(stats)
            if (ordersRes.success) {
                setRecentOrders(ordersRes.data)
            }
            if (showLoading) setLoading(false)
        }

        loadData(refreshSignal === 0)

        // Poll every 30 seconds
        const interval = setInterval(() => {
            loadData(false)
        }, 30000)

        return () => clearInterval(interval)
    }, [refreshSignal])

    const stats = [
        {
            title: "Ventas Totales",
            value: `S/ ${typeof statsData.sales === 'number' ? statsData.sales.toFixed(2) : statsData.sales}`,
            description: "Recaudado",
            icon: DollarSign,
            color: "text-green-600 bg-green-100",
        },
        {
            title: "Pedidos Pendientes",
            value: statsData.pendingOrders,
            description: "Por atender",
            icon: ShoppingBag,
            color: "text-blue-600 bg-blue-100",
        },
        {
            title: "Productos",
            value: statsData.products,
            description: "En catálogo",
            icon: Package,
            color: "text-orange-600 bg-orange-100",
        },
        {
            title: "Clientes",
            value: statsData.customers,
            description: "Registrados",
            icon: Users,
            color: "text-purple-600 bg-purple-100",
        },
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-800">Resumen de Negocio</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setRefreshSignal(s => s + 1)}
                        className="rounded-full h-8 w-8 text-muted-foreground hover:text-primary"
                        disabled={loading}
                    >
                        <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
                    </Button>
                </div>
                <button
                    onClick={async () => {
                        const res = await setupDatabase()
                        if (res.success) toast.success("Base de datos configurada correctamente!")
                        else toast.error("Error al configurar base de datos (revisa consola)")
                    }}
                    className="text-xs bg-gray-900 text-white px-3 py-2 rounded-md hover:bg-gray-800"
                >
                    Setup DB (Inicializar)
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${stat.color}`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                                {loading && statsData.sales === 0 ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Sales & Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-gray-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Ventas Recientes</CardTitle>
                        <Button asChild variant="ghost" size="sm" className="text-primary text-xs">
                            <Link href="/admin/pedidos">Ver todos</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {loading && recentOrders.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-primary/30" />
                            </div>
                        ) : recentOrders.length > 0 ? (
                            <div className="space-y-8">
                                {recentOrders.map((order, i) => (
                                    <div className="flex items-center" key={order?.id || i}>
                                        <div className="bg-primary/10 h-9 w-9 rounded-full flex items-center justify-center font-bold text-primary text-xs">
                                            {(order?.customer_name || "C").charAt(0)}{(order?.customer_name?.split(" ")[1])?.charAt(0) || ""}
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none text-gray-900">{order?.customer_name || "Cliente"}</p>
                                            <p className="text-xs text-muted-foreground">{order?.customer_email || ""}</p>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <div className="font-medium text-gray-900 text-sm">S/ {parseFloat(order?.total_amount || "0").toFixed(2)}</div>
                                            <p className="text-[10px] text-gray-400">
                                                {order?.created_at ? new Date(order.created_at).toLocaleDateString() : ""}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                No hay pedidos registrados.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-gray-100 shadow-sm bg-primary/5 border-primary/10">
                    <CardHeader>
                        <CardTitle className="text-primary">Acciones Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-white rounded-lg border border-primary/10 shadow-sm">
                            <h4 className="font-semibold text-gray-800 text-sm">Nuevo Producto</h4>
                            <p className="text-xs text-gray-500 mt-1 mb-3">Añade un nuevo pastel al catálogo.</p>
                            <Button asChild className="w-full text-xs font-medium">
                                <Link href="/admin/productos/nuevo">Crear Producto</Link>
                            </Button>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-primary/10 shadow-sm">
                            <h4 className="font-semibold text-gray-800 text-sm">Ver Pedidos</h4>
                            <p className="text-xs text-gray-500 mt-1 mb-3">Tienes {statsData.pendingOrders} pedidos por atender.</p>
                            <Button asChild variant="outline" className="w-full text-xs border border-primary text-primary hover:bg-primary/5 font-medium">
                                <Link href="/admin/pedidos">Ir a Pedidos</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
