"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, AlertCircle, MessageCircle, Send } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Loader2, RefreshCcw, FileDown, FileSpreadsheet, FileText } from "lucide-react"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { cn } from "@/lib/utils"
import { getOrders, updateOrderStatus, getOrderById, getStoreSettings } from "../actions"

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 15

    // For Details Modal
    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [loadingDetails, setLoadingDetails] = useState(false)
    const [businessPhone, setBusinessPhone] = useState("51997935991")

    useEffect(() => {
        loadOrders(true)
        loadSettings()

        // Poll every 30 seconds for new orders
        const interval = setInterval(() => {
            loadOrders(false)
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    async function loadSettings() {
        const res = await getStoreSettings()
        if (res.success && res.data && res.data.contact_phone) {
            let cleanPhone = res.data.contact_phone.replace(/\D/g, '')
            if (cleanPhone.length === 9 && !cleanPhone.startsWith('51')) {
                cleanPhone = '51' + cleanPhone
            }
            setBusinessPhone(cleanPhone)
        }
    }

    async function loadOrders(showLoading = true) {
        if (showLoading) setLoading(true)
        const res: any = await getOrders()
        if (res.success) {
            setOrders(res.data)
        }
        if (showLoading) setLoading(false)
    }

    async function handleViewDetails(id: number) {
        setLoadingDetails(true)
        setIsDetailsOpen(true)
        const res = await getOrderById(id)
        if (res.success) {
            setSelectedOrder(res.data)
        }
        setLoadingDetails(false)
    }

    async function handleStatusChange(id: number, newStatus: string) {
        const res = await updateOrderStatus(id, newStatus)
        if (res.success) {
            loadOrders()
            if (selectedOrder && selectedOrder.id === id) {
                setSelectedOrder({ ...selectedOrder, status: newStatus })
            }
        } else {
            alert("Error al actualizar el estado")
        }
    }

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.order_number && order.order_number.toString().includes(searchTerm))

        const matchesStatus = statusFilter === "all" || order.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
    const displayedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, statusFilter])

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "bg-green-100 text-green-700 border-green-200"
            case "processing": return "bg-blue-100 text-blue-700 border-blue-200"
            case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200"
            case "cancelled": return "bg-red-100 text-red-700 border-red-200"
            default: return "bg-gray-100 text-gray-600 border-gray-200"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "completed": return "Completado"
            case "processing": return "Procesando"
            case "pending": return "Pendiente"
            case "cancelled": return "Cancelado"
            default: return status
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Pedidos</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => loadOrders(true)}
                        className="rounded-full h-8 w-8 text-muted-foreground hover:text-primary"
                        disabled={loading}
                    >
                        <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
                    </Button>
                </div>
                <p className="text-gray-500">Gestiona y procesa las órdenes de tus clientes en tiempo real.</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por cliente o ID..."
                        className="pl-9 border-gray-200 focus:border-primary/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <select
                        className="h-10 rounded-md border border-gray-200 bg-white text-sm px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Todos los estados</option>
                        <option value="pending">Pendiente</option>
                        <option value="processing">Procesando</option>
                        <option value="completed">Completado</option>
                        <option value="cancelled">Cancelado</option>
                    </select>

                    <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
                        <Button
                            variant="outline"
                            size="icon"
                            title="Exportar PDF"
                            onClick={() => {
                                const doc = new jsPDF()
                                doc.text("Reporte de Pedidos", 14, 15)
                                const tableColumn = ["ID", "Cliente", "Fecha Evento", "Total", "Estado"]
                                const tableRows = filteredOrders.map(order => [
                                    order.order_number || order.id,
                                    order.customer_name,
                                    order.event_date ? new Date(order.event_date).toLocaleDateString('es-PE') : '-',
                                    `S/ ${parseFloat(order.total_amount).toFixed(2)}`,
                                    getStatusLabel(order.status)
                                ])
                                autoTable(doc, {
                                    head: [tableColumn],
                                    body: tableRows,
                                    startY: 20,
                                })
                                doc.save("pedidos.pdf")
                            }}
                            className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <FileDown className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            title="Exportar Excel"
                            onClick={() => {
                                const worksheet = XLSX.utils.json_to_sheet(filteredOrders.map(order => ({
                                    ID: order.order_number || order.id,
                                    Cliente: order.customer_name,
                                    Email: order.customer_email,
                                    Telefono: order.customer_phone,
                                    Fecha_Evento: order.event_date ? new Date(order.event_date).toLocaleDateString('es-PE') : '-',
                                    Hora: order.event_time,
                                    Total: parseFloat(order.total_amount).toFixed(2),
                                    Estado: getStatusLabel(order.status),
                                    Direccion: order.delivery_address
                                })))
                                const workbook = XLSX.utils.book_new()
                                XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos")
                                XLSX.writeFile(workbook, "pedidos.xlsx")
                            }}
                            className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            title="Exportar CSV" // Added CSV button
                            onClick={() => {
                                const worksheet = XLSX.utils.json_to_sheet(filteredOrders.map(order => ({
                                    ID: order.order_number || order.id,
                                    Cliente: order.customer_name,
                                    Email: order.customer_email,
                                    Telefono: order.customer_phone,
                                    Fecha_Evento: order.event_date ? new Date(order.event_date).toLocaleDateString('es-PE') : '-',
                                    Hora: order.event_time,
                                    Total: parseFloat(order.total_amount).toFixed(2),
                                    Estado: getStatusLabel(order.status),
                                    Direccion: order.delivery_address
                                })))
                                const csv = XLSX.utils.sheet_to_csv(worksheet)
                                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                                const link = document.createElement("a")
                                const url = URL.createObjectURL(blob)
                                link.setAttribute("href", url)
                                link.setAttribute("download", "pedidos.csv")
                                link.style.visibility = 'hidden'
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
                            }}
                            className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                            <FileText className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="ml-auto text-sm text-gray-500">
                    <span className="font-medium text-gray-900">{filteredOrders.length}</span> pedidos encontrados
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">ID Orden</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Fecha Evento</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 relative">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                            <p className="text-gray-500">Cargando pedidos...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : displayedOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-mono font-medium text-gray-900">
                                        #{order.order_number || order.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{order.customer_name}</div>
                                        <div className="text-xs text-gray-500">{order.customer_email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {order.event_date ? new Date(order.event_date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                        <div className="text-[10px] text-gray-400">{order.event_time}</div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        S/ {parseFloat(order.total_amount).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={cn(
                                                "px-2.5 py-1 rounded-full text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-colors",
                                                getStatusColor(order.status)
                                            )}
                                        >
                                            <option value="pending">Pendiente</option>
                                            <option value="processing">Procesando</option>
                                            <option value="completed">Completado</option>
                                            <option value="cancelled">Cancelado</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary hover:text-primary hover:bg-primary/10 h-8 w-8 p-0 rounded-full"
                                            onClick={() => handleViewDetails(order.id)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!loading && filteredOrders.length === 0 && (
                    <div className="text-center py-20">
                        <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500">No se encontraron pedidos.</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredOrders.length)} de {filteredOrders.length} pedidos
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </Button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum = i + 1;
                                    if (totalPages > 5) {
                                        if (currentPage > 3) {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        if (pageNum > totalPages) {
                                            pageNum = totalPages - 4 + i;
                                        }
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"}
                                            size="sm"
                                            className="w-8 h-8 p-0"
                                            onClick={() => setCurrentPage(pageNum)}
                                        >
                                            {pageNum}
                                        </Button>
                                    )
                                })}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Siguiente
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Details Drawer */}
            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-2xl font-serif">Detalle del Pedido</SheetTitle>
                        <SheetDescription>
                            Información completa de la orden y el cliente.
                        </SheetDescription>
                    </SheetHeader>

                    {loadingDetails ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : selectedOrder && (
                        <div className="space-y-8">
                            {/* Order Info */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Orden</span>
                                    <span className="font-mono font-bold text-lg text-primary">#{selectedOrder.order_number}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</span>
                                    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", getStatusColor(selectedOrder.status))}>
                                        {getStatusLabel(selectedOrder.status)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</span>
                                    <span className="font-bold text-lg">S/ {parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-sm text-gray-900 border-b pb-2">Datos del Cliente</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase">Nombre</p>
                                        <p className="font-medium">{selectedOrder.customer_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase">Teléfono</p>
                                        <p className="font-medium">{selectedOrder.customer_phone}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-400 text-xs uppercase">Email</p>
                                        <p className="font-medium">{selectedOrder.customer_email}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-400 text-xs uppercase">Dirección de Entrega</p>
                                        <p className="font-medium">{selectedOrder.delivery_address}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase">Fecha Evento</p>
                                        <p className="font-medium">{new Date(selectedOrder.event_date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase">Hora Evento</p>
                                        <p className="font-medium">{selectedOrder.event_time}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-sm text-gray-900 border-b pb-2">Productos</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item: any) => (
                                        <div key={item.id} className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.product_name}</p>
                                                <p className="text-xs text-gray-500">Cantidad: {item.quantity} x S/ {parseFloat(item.unit_price).toFixed(2)}</p>
                                            </div>
                                            <p className="font-bold text-gray-900">S/ {parseFloat(item.subtotal).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <div className="space-y-2">
                                    <h4 className="font-bold text-sm text-gray-900">Notas del Cliente</h4>
                                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-xs text-yellow-800 italic">
                                        "{selectedOrder.notes}"
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex flex-col gap-2">
                                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                                    <a href={`https://wa.me/${selectedOrder.customer_phone.replace(/\D/g, '').length === 9 ? '51' + selectedOrder.customer_phone.replace(/\D/g, '') : selectedOrder.customer_phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(selectedOrder.customer_name)},%20te%20escribimos%20de%20Tortas%20Nery%20respecto%20a%20tu%20pedido%20%23${selectedOrder.order_number}.`} target="_blank">
                                        <MessageCircle className="w-4 h-4 mr-2" /> Contactar Cliente
                                    </a>
                                </Button>
                                <Button asChild variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                                    <a href={`https://wa.me/${businessPhone}?text=${encodeURIComponent(`Reenvío de Pedido #${selectedOrder.order_number}:\nCliente: ${selectedOrder.customer_name}\nTotal: S/ ${selectedOrder.total_amount}\nFecha: ${selectedOrder.event_date}`)}`} target="_blank">
                                        <Send className="w-4 h-4 mr-2" /> Reenviar a mi WhatsApp
                                    </a>
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
