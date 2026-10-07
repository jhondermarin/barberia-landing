"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CartItem = { productoId: number; nombre: string; precio: number; cantidad: number };

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cantidad">) => void;
  removeItem: (productoId: number) => void;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(item: Omit<CartItem, "cantidad">) {
    setItems((prev) => {
      const existe = prev.find((i) => i.productoId === item.productoId);
      if (existe) {
        return prev.map((i) => i.productoId === item.productoId ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  }

  function removeItem(productoId: number) {
    setItems((prev) => prev.filter((i) => i.productoId !== productoId));
  }

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}