"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, ShoppingBag, User, LogOut, UserPlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useCart } from "@/context/cart-context"
import { motion, AnimatePresence } from "framer-motion"
import { getAdminSession, logout, registerUser } from "@/app/admin/actions"
import { toast } from "sonner"

const navigation = [
    { name: "Inicio", href: "/#hero" },
    { name: "Bodas", href: "/#servicios" },
    { name: "Productos", href: "/productos" },
    { name: "Testimonios", href: "/#testimonios" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isRegOpen, setIsRegOpen] = React.useState(false)
    const [user, setUser] = React.useState<any>(null)
    const [regLoading, setRegLoading] = React.useState(false)
    const { cartCount } = useCart()
    const router = useRouter()

    React.useEffect(() => {
        checkSession()
    }, [])

    async function checkSession() {
        const session = await getAdminSession()
        setUser(session)
    }

    async function handleLogout() {
        await logout()
        setUser(null)
        toast.success("Sesión cerrada")
        router.push("/")
        router.refresh()
    }

    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setRegLoading(true)
        const formData = new FormData(e.currentTarget)

        const res = await registerUser(formData)
        if (res.success) {
            toast.success("¡Cuenta creada con éxito! Ya puedes iniciar sesión.")
            setIsRegOpen(false)
        } else {
            toast.error(res.error || "Error al registrar")
        }
        setRegLoading(false)
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">

                {/* Logo */}
                <Link href="/" className="group flex items-center space-x-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary/20 shadow-sm group-hover:border-primary transition-colors">
                        <Image src="/img/logo.jpg" alt="Tortas Nery Logo" fill className="object-cover" />
                    </div>
                    <span className="text-xl font-serif font-bold text-primary tracking-wide group-hover:text-primary transition-colors">Tortas Nery</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:gap-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium transition-colors hover:text-primary relative group"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}

                    {/* Cart Icon */}
                    <Link href="/carrito" className="relative group">
                        <div className="p-2 rounded-full hover:bg-muted transition-colors">
                            <ShoppingBag className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-background"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </Link>

                    {/* Auth Section */}
                    <div className="flex items-center gap-2 border-l pl-4 ml-2 border-border/40">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden lg:block text-right">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Sesión iniciada</p>
                                    <p className="text-xs font-medium text-foreground">{user.name}</p>
                                </div>
                                <Button asChild variant="ghost" size="sm" className="rounded-full h-9 hover:bg-primary/10 text-primary">
                                    <Link href="/mis-pedidos">Mis Pedidos</Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="rounded-full h-9 px-4 border-primary/20 hover:bg-primary/5 text-primary"
                                >
                                    <LogOut className="w-4 h-4 mr-2" /> Salir
                                </Button>
                                {user.role === 'admin' && (
                                    <Button asChild size="sm" className="rounded-full h-9 bg-foreground text-white hover:bg-primary">
                                        <Link href="/admin">Panel</Link>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button asChild variant="ghost" size="sm" className="rounded-full h-9 hover:bg-primary/10 hover:text-primary transition-all">
                                    <Link href="/login"><User className="w-4 h-4 mr-2" /> Entrar</Link>
                                </Button>

                                <Dialog open={isRegOpen} onOpenChange={setIsRegOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="rounded-full h-9 bg-primary text-white hover:bg-primary/90 shadow-sm">
                                            <UserPlus className="w-4 h-4 mr-2" /> Crear Cuenta
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle className="font-serif text-2xl">Crea tu Cuenta</DialogTitle>
                                            <DialogDescription>
                                                Únete a nuestra familia y descubre beneficios exclusivos para tus celebraciones.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleRegister} className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName">Nombre Completo</Label>
                                                <Input id="fullName" name="fullName" placeholder="Ej: Maria Garcia" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Correo Electrónico</Label>
                                                <Input id="email" name="email" type="email" placeholder="maria@ejemplo.com" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="password">Contraseña</Label>
                                                <Input id="password" name="password" type="password" placeholder="••••••••" required />
                                            </div>
                                            <DialogFooter className="pt-4">
                                                <Button type="submit" className="w-full bg-primary" disabled={regLoading}>
                                                    {regLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registrando...</> : "Registrarme Ahora"}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex items-center gap-4 md:hidden">
                    {/* Mobile Cart */}
                    <Link href="/carrito" className="relative">
                        <ShoppingBag className="w-6 h-6 text-foreground" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-background">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Acceso rápido a perfil/login en móvil */}
                    {user ? (
                        <Link href="/mis-pedidos" className="flex items-center justify-center">
                            <div className="bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center font-bold text-primary text-xs border border-primary/20">
                                {user.name.charAt(0)}
                            </div>
                        </Link>
                    ) : (
                        <Link href="/login" className="text-foreground hover:text-primary transition-colors">
                            <User className="h-6 w-6" />
                        </Link>
                    )}

                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <SheetHeader>
                                <SheetTitle className="text-left font-serif font-bold text-2xl">Menú</SheetTitle>
                                <SheetDescription className="sr-only">Navegación principal</SheetDescription>
                            </SheetHeader>
                            <nav className="flex flex-col gap-4 mt-8">
                                {user && (
                                    <div className="bg-primary/5 p-4 rounded-xl mb-4">
                                        <p className="text-xs text-primary font-bold uppercase tracking-wider">Bienvenido</p>
                                        <p className="font-serif font-bold text-lg">{user.name}</p>
                                        <Link
                                            href="/mis-pedidos"
                                            className="text-xs font-bold text-primary hover:underline mt-2 inline-block"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Ver Mis Pedidos
                                        </Link>
                                    </div>
                                )}
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-lg font-medium hover:text-primary border-b border-border/50 pb-2"
                                        onClick={() => setIsOpen(false)}
                                    >\
                                        {item.name}
                                    </Link>
                                ))}
                                {user ? (
                                    <Button onClick={handleLogout} variant="outline" className="mt-4 w-full border-primary text-primary">
                                        <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                                    </Button>
                                ) : (
                                    <div className="flex flex-col gap-3 mt-4">
                                        <Button asChild className="w-full bg-primary">
                                            <Link href="/login"><User className="mr-2 h-4 w-4" /> Entrar</Link>
                                        </Button>
                                        <Button variant="outline" onClick={() => { setIsOpen(false); setIsRegOpen(true); }} className="w-full border-primary text-primary">
                                            <UserPlus className="mr-2 h-4 w-4" /> Crear Cuenta
                                        </Button>
                                    </div>
                                )}
                                {user?.role === 'admin' && (
                                    <Button asChild className="mt-2 w-full bg-foreground">
                                        <Link href="/admin">Panel Admin</Link>
                                    </Button>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}
