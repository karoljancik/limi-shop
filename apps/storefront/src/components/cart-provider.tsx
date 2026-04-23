"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { loadCurrentCart } from "@/lib/cart-client";

type CartContextType = {
  itemCount: number;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [itemCount, setItemCount] = useState(0);

  const refreshCart = useCallback(async () => {
    const cart = await loadCurrentCart();
    // Sum up quantities of all items
    const count = cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
    setItemCount(count);
  }, []);

  // Initial load
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ itemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
