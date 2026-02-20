"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Loader2, Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const res = await login(formData)

        if (res.success) {
            router.push("/admin")
            router.refresh()
        } else {
            setError(res.error || "Error al iniciar sesión")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#fdfdfd] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl mb-4 group hover:scale-105 transition-transform duration-300">
                        <Image src="/img/logo.jpg" alt="Logo" fill className="object-cover" />
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">Tortas Nery</h1>
                    <p className="text-gray-500 font-light mt-1 uppercase tracking-[0.2em] text-xs font-bold">Panel Administrativo</p>
                </div>

                <Card className="border-0 shadow-2xl shadow-gray-200/50 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pt-8 px-8">
                        <CardTitle className="text-2xl font-serif font-bold text-center">Bienvenido</CardTitle>
                        <CardDescription className="text-center font-light">
                            Ingresa tus credenciales para gestionar tu pastelería.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4 px-8">
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
                                    >
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700 ml-1">Correo Electrónico</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="admin@tortasnery.com"
                                        required
                                        className="pl-10 h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-primary focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700 ml-1">Contraseña</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        className="pl-10 pr-10 h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-primary focus:border-primary transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 pb-10 px-8">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Iniciar Sesión"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <p className="mt-8 text-center text-gray-400 text-sm font-light">
                    &copy; {new Date().getFullYear()} Tortas Nery. Todos los derechos reservados.
                </p>
            </motion.div>
        </div>
    )
}
