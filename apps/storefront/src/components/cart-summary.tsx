"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadCurrentCart } from "@/lib/cart-client";
import { formatPrice, getCartItemImageSrc, type StoreCart } from "@/lib/medusa";

export function CartSummary() {
  const [cart, setCart] = useState<StoreCart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    loadCurrentCart()
      .then((nextCart) => {
        if (mounted) {
          setCart(nextCart);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-[var(--muted)]">Načítavam košík...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <p data-testid="empty-cart" className="text-sm text-[var(--muted)]">
        Košík je zatiaľ prázdny.
      </p>
    );
  }

  return (
    <div className="space-y-4" data-testid="cart-summary">
      {cart.items.map((item) => (
        <div
          key={item.id}
          className="card flex items-center gap-4 p-4"
          data-testid="cart-item"
        >
          {getCartItemImageSrc(item) ? (
            <Image
              src={getCartItemImageSrc(item)!}
              alt={item.product_title}
              width={84}
              height={84}
              unoptimized
              className="h-20 w-20 rounded-2xl object-cover"
            />
          ) : null}
          <div className="flex-1">
            <Link href={`/shop/${item.product_handle}`} className="font-semibold">
              {item.product_title}
            </Link>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Množstvo: {item.quantity}
            </p>
          </div>
          <p className="font-semibold">{formatPrice(item.unit_price)}</p>
        </div>
      ))}

      <div className="card p-5">
        <div className="flex items-center justify-between text-sm text-[var(--muted)]">
          <span>Medzisúčet</span>
          <span>{formatPrice(cart.subtotal, cart.currency_code)}</span>
        </div>
        <div
          className="mt-3 flex items-center justify-between text-lg font-bold"
          data-testid="cart-total"
        >
          <span>Spolu</span>
          <span>{formatPrice(cart.total, cart.currency_code)}</span>
        </div>
      </div>
    </div>
  );
}
