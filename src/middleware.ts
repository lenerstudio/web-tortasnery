import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "tortasnery_super_secret_key_123456789")

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1. Skip if not an admin route
    if (!pathname.startsWith('/admin')) {
        return NextResponse.next()
    }

    // 2. Allow login page
    if (pathname === '/admin/login') {
        const token = request.cookies.get('admin_session')?.value
        if (token) {
            try {
                await jwtVerify(token, SECRET_KEY)
                // If valid token and on login, redirect to admin dashboard
                return NextResponse.redirect(new URL('/admin', request.url))
            } catch (e) {
                // Invalid token, stay on login
            }
        }
        return NextResponse.next()
    }

    // 3. Protect all other /admin routes
    const token = request.cookies.get('admin_session')?.value

    if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
        await jwtVerify(token, SECRET_KEY)
        return NextResponse.next()
    } catch (error) {
        console.error("Middleware Auth Error:", error)
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }
}

export const config = {
    matcher: ['/admin/:path*'],
}
