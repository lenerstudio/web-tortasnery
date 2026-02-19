"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type Product = {
    id: number
    name: string
    price: number
    image: string
    desc: string
}

type CartItem = Product & {
    quantity: number
}

type CartContextType = {
    items: CartItem[]
    addItem: (product: Product) => void
    removeItem: (id: number) => void
    clearCart: () => void
    cartCount: number
    cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error("Failed to parse cart", e)
            }
        }
    }, [])

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items))
    }, [items])

    const addItem = (product: Product) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id)
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prev, { ...product, quantity: 1 }]
        })
    }

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id))
    }

    const clearCart = () => setItems([])

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)
    const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
