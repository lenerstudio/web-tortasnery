"use client"

import { useEffect, useState } from "react"
import { getUsers, deleteUser } from "../actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, User, Mail, Shield, Clock, Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

import { toast } from "sonner"

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        setLoading(true)
        try {
            const res: any = await getUsers()
            if (res.success && Array.isArray(res.data)) {
                setUsers(res.data)
            } else {
                toast.error(res.error || "No se pudieron cargar los usuarios")
            }
        } catch (e) {
            toast.error("Error de conexión al cargar usuarios")
        }
        setLoading(false)
    }

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de eliminar este usuario?")) {
            try {
                const res: any = await deleteUser(id)
                if (res.success) {
                    toast.success("Usuario eliminado correctamente")
                    loadUsers()
                } else {
                    toast.error(res.error || "No se pudo eliminar el usuario")
                }
            } catch (e) {
                toast.error("Error al procesar la eliminación")
            }
        }
    }

    const filteredUsers = users.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Usuarios</h2>
                <p className="text-gray-500">Administra los accesos al panel administrativo.</p>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Buscar usuario..."
                        className="pl-9 border-gray-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 italic text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin text-primary/30 mb-2" />
                        Cargando usuarios...
                    </div>
                ) : filteredUsers.length > 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Usuario</th>
                                    <th className="px-6 py-4">Rol</th>
                                    <th className="px-6 py-4">Último Acceso</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                                    {user.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.full_name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                <Shield className="w-3 h-3" />
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            {user.last_login
                                                ? new Date(user.last_login).toLocaleString()
                                                : "Nunca"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Card className="border-dashed border-2 py-12 text-center text-gray-400">
                        <CardContent>
                            No se encontraron usuarios que coincidan con la búsqueda.
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
