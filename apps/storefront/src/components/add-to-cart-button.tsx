"use client";

import { useState, useTransition } from "react";
import { addVariantToCart } from "@/lib/cart-client";

export function AddToCartButton({ variantId }: { variantId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const normalizedQuantity = Number.isFinite(quantity) ? Math.min(99, Math.max(1, quantity)) : 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="product-quantity" className="text-sm font-semibold">
          Pocet kusov
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center overflow-hidden rounded-full border border-[var(--line)] bg-white/90 shadow-[0_12px_24px_rgba(194,159,198,0.14)]">
            <button
              type="button"
              className="h-11 w-11 text-xl font-semibold text-[var(--foreground)] transition hover:bg-[rgba(241,196,206,0.24)] disabled:opacity-50"
              aria-label="Znizit pocet kusov"
              onClick={() => {
                setQuantity((current) => Math.max(1, current - 1));
              }}
              disabled={isPending || normalizedQuantity <= 1}
            >
              -
            </button>
            <input
              id="product-quantity"
              type="number"
              min={1}
              max={99}
              inputMode="numeric"
              className="h-11 w-[4.5rem] border-x border-[var(--line)] bg-transparent px-3 text-center font-semibold outline-none"
              value={normalizedQuantity}
              onChange={(event) => {
                const nextValue = Number.parseInt(event.target.value, 10);
                setQuantity(Number.isNaN(nextValue) ? 1 : nextValue);
              }}
            />
            <button
              type="button"
              className="h-11 w-11 text-xl font-semibold text-[var(--foreground)] transition hover:bg-[rgba(241,196,206,0.24)] disabled:opacity-50"
              aria-label="Zvysit pocet kusov"
              onClick={() => {
                setQuantity((current) => Math.min(99, current + 1));
              }}
              disabled={isPending || normalizedQuantity >= 99}
            >
              +
            </button>
          </div>
          <p className="text-sm text-[var(--muted)]">Vyber si, kolko kusov chces pridat do kosika.</p>
        </div>
      </div>

      <button
        type="button"
        className="btn-primary"
        data-testid="add-to-cart"
        onClick={() => {
          startTransition(async () => {
            try {
              await addVariantToCart(variantId, normalizedQuantity);
              setMessage(
                normalizedQuantity === 1
                  ? "Produkt bol pridany do kosika."
                  : `${normalizedQuantity} ks boli pridane do kosika.`
              );
            } catch {
              setMessage("Nepodarilo sa pridat produkt do kosika.");
            }
          });
        }}
        disabled={isPending}
      >
        {isPending ? "Pridavam..." : "Pridat do kosika"}
      </button>

      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}
