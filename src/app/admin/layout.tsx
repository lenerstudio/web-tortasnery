"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    ExternalLink,
    Users
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { logout, getAdminSession } from "./actions"

const sidebarItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
    { name: "Productos", href: "/admin/productos", icon: Package },
    { name: "Usuarios", href: "/admin/usuarios", icon: Users },
    { name: "Configuración", href: "/admin/configuracion", icon: Settings },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [user, setUser] = useState<any>(null)

    const isLoginPage = pathname === "/admin/login"

    useEffect(() => {
        if (!isLoginPage) {
            async function fetchUser() {
                const session = await getAdminSession()
                if (session) setUser(session)
            }
            fetchUser()
        }
    }, [isLoginPage])

    const handleLogout = async () => {
        await logout()
        router.push("/admin/login")
        router.refresh()
    }

    if (isLoginPage) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col md:flex-row font-sans">

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                        <Image src="/img/logo.jpg" alt="Logo" fill className="object-cover" />
                    </div>
                    <span className="font-serif font-bold text-lg text-gray-900">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-500")} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 gap-3"
                    >
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </Button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                        <Image src="/img/logo.jpg" alt="Logo" fill className="object-cover" />
                    </div>
                    <span className="font-serif font-bold text-lg text-gray-900">Admin</span>
                </div>
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[80%] max-w-[300px] p-0">
                        <SheetHeader className="p-6 border-b border-gray-100 text-left">
                            <SheetTitle className="font-serif font-bold text-xl">Menú Admin</SheetTitle>
                            <SheetDescription className="text-xs">Gestiona tu pastelería</SheetDescription>
                        </SheetHeader>
                        <nav className="p-4 space-y-1">
                            {sidebarItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-gray-600 hover:bg-gray-100"
                                        )}
                                    >
                                        <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-500")} />
                                        {item.name}
                                    </Link>
                                )
                            })}
                            <Link
                                href="/"
                                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 border-t border-gray-100 mt-2"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Ir a la Web
                            </Link>
                        </nav>
                        <div className="p-4 mt-auto border-t border-gray-100 absolute bottom-0 w-full">
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 gap-3"
                            >
                                <LogOut className="w-5 h-5" />
                                Salir
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50/50">
                {/* Topbar */}
                <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-10 md:static">
                    <h1 className="font-serif font-bold text-xl text-gray-800 capitalize md:block hidden">
                        {pathname.split("/").pop() || "Dashboard"}
                    </h1>
                    <div className="flex items-center gap-4 ml-auto">
                        <Button asChild variant="outline" size="sm" className="hidden sm:flex gap-2 text-gray-600 border-gray-200 hover:bg-gray-50">
                            <Link href="/">
                                <ExternalLink className="w-4 h-4" />
                                Ver Sitio
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-primary">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
                        </Button>
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{user?.name || "Admin User"}</p>
                                <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Propietario' : 'Usuario'}</p>
                            </div>
                            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold uppercase transition-transform hover:scale-110">
                                {(user?.name || "A").charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 max-w-7xl mx-auto space-y-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
