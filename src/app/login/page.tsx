"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, ArrowLeft, Lock, Mail, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { login } from "@/app/admin/actions"
import { toast } from "sonner"
import { Navbar } from "@/components/sections/navbar"
import { Footer } from "@/components/sections/footer"

function LoginContent() {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get("redirect") || "/"

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const res = await login(formData)

        if (res.success) {
            toast.success("¡Bienvenido de nuevo!")
            router.push(redirectTo)
            router.refresh()
        } else {
            toast.error(res.error || "Credenciales incorrectas")
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-4 py-20 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

                <Card className="w-full max-w-md border-border/40 shadow-2xl shadow-black/5 relative z-10 bg-white/80 backdrop-blur-sm rounded-[2rem] overflow-hidden">
                    <CardHeader className="space-y-1 pb-8 text-center pt-10">
                        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 rotate-3 group-hover:rotate-0 transition-transform">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-serif font-bold tracking-tight">Iniciar Sesión</CardTitle>
                        <CardDescription className="text-muted-foreground pt-2">
                            Ingresa tus credenciales para continuar con tu pedido.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-10 px-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold text-muted-foreground pl-1">Correo Electrónico</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="ejemplo@correo.com"
                                        required
                                        className="h-12 pl-11 bg-secondary/5 border-secondary/20 rounded-xl focus:border-primary/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between pl-1">
                                    <Label htmlFor="password" className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Contraseña</Label>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        className="h-12 pl-11 pr-10 bg-secondary/5 border-secondary/20 rounded-xl focus:border-primary/50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar a mi Cuenta"}
                            </Button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-border/40 text-center">
                            <p className="text-sm text-muted-foreground">
                                ¿No tienes una cuenta?{" "}
                                <Link href="/#hero" className="text-primary font-bold hover:underline">
                                    Regístrate en la barra superior
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
