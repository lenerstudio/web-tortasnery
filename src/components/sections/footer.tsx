import Link from "next/link"
import { Facebook, Instagram, Mail } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-[#1f0a0a] text-white/80 py-20 border-t border-white/5">
            <div className="container grid md:grid-cols-4 gap-12 items-start">

                <div className="space-y-6">
                    <h3 className="font-serif text-3xl font-bold text-primary tracking-tighter">Tortas Nery</h3>
                    <p className="text-sm font-light leading-relaxed max-w-xs text-white/60">
                        Arte comestible y pastelería de autor. Diseñando momentos dulces que perduran en la memoria.
                    </p>
                </div>

                <div className="space-y-6">
                    <h4 className="font-serif font-medium text-lg text-white">Explora</h4>
                    <ul className="space-y-3 text-sm font-light">
                        <li><Link href="#hero" className="hover:text-primary transition-colors">Inicio</Link></li>
                        <li><Link href="#servicios" className="hover:text-primary transition-colors">Servicios Exclusivos</Link></li>
                        <li><Link href="#galeria" className="hover:text-primary transition-colors">Galería de Arte</Link></li>
                        <li><Link href="#testimonios" className="hover:text-primary transition-colors">Novias Felices</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="font-serif font-medium text-lg text-white">Contacto Privado</h4>
                    <ul className="space-y-3 text-sm font-light">
                        <li><span className="opacity-50 block text-xs uppercase tracking-wider mb-1">Citas y Degustaciones</span>+51 999 999 999</li>
                        <li><span className="opacity-50 block text-xs uppercase tracking-wider mb-1">Email Corporativo</span>contacto@tortasnery.com</li>
                        <li><span className="opacity-50 block text-xs uppercase tracking-wider mb-1">Atelier</span>Av. Siempre Viva 123, Lima.</li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="font-serif font-medium text-lg text-white">Síguenos</h4>
                    <div className="flex gap-4">
                        <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-primary hover:text-foreground transition-all duration-300 group">
                            <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </Link>
                        <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-primary hover:text-foreground transition-all duration-300 group">
                            <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </Link>
                        <Link href="#" className="p-3 bg-white/5 rounded-full hover:bg-primary hover:text-foreground transition-all duration-300 group">
                            <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </Link>
                    </div>
                </div>

            </div>
            <div className="container mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 font-light gap-4">
                <span>© {new Date().getFullYear()} Tortas Nery. Todos los derechos reservados.</span>
                <div className="flex gap-6">
                    <Link href="#" className="hover:text-white transition-colors">Política de Privacidad</Link>
                    <Link href="#" className="hover:text-white transition-colors">Términos y Condiciones</Link>
                </div>
            </div>
        </footer>
    )
}
