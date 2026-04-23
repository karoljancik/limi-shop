"use client";

import { useState, useTransition } from "react";
import { addVariantToCart } from "@/lib/cart-client";
import { useCart } from "@/components/cart-provider";

export function AddToCartButton({
  variantId,
  disabled = false,
  outOfStock = false,
}: {
  variantId: string;
  disabled?: boolean;
  outOfStock?: boolean;
}) {
  const { refreshCart } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const normalizedQuantity = Number.isFinite(quantity) ? Math.min(99, Math.max(1, quantity)) : 1;

  if (outOfStock) {
    return (
      <div className="flex flex-col gap-4">
        <button type="button" className="btn-primary opacity-50 cursor-not-allowed" disabled>
          Vypredané
        </button>
        <p className="text-sm text-red-500 font-medium">
          Tento produkt momentálne nie je k dispozícii.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="product-quantity" className="text-sm font-semibold">
          Počet kusov
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center overflow-hidden rounded-full border border-[var(--line)] bg-white/90 shadow-[0_12px_24px_rgba(194,159,198,0.14)]">
            <button
              type="button"
              className="h-11 w-11 text-xl font-semibold text-[var(--foreground)] transition hover:bg-[rgba(241,196,206,0.24)] disabled:opacity-50"
              aria-label="Znížiť počet kusov"
              onClick={() => {
                setQuantity((current) => Math.max(1, current - 1));
              }}
              disabled={isPending || disabled || normalizedQuantity <= 1}
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
              disabled={isPending || disabled}
            />
            <button
              type="button"
              className="h-11 w-11 text-xl font-semibold text-[var(--foreground)] transition hover:bg-[rgba(241,196,206,0.24)] disabled:opacity-50"
              aria-label="Zvýšiť počet kusov"
              onClick={() => {
                setQuantity((current) => Math.min(99, current + 1));
              }}
              disabled={isPending || disabled || normalizedQuantity >= 99}
            >
              +
            </button>
          </div>
          <p className="text-sm text-[var(--muted)]">Vyber si, koľko kusov chceš pridať do košíka.</p>
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
              await refreshCart();
              setMessage(
                normalizedQuantity === 1
                  ? "Produkt bol pridaný do košíka."
                  : `${normalizedQuantity} ks boli pridané do košíka.`
              );
            } catch {
              setMessage("Nepodarilo sa pridať produkt do košíka.");
            }
          });
        }}
        disabled={isPending || disabled}
      >
        {isPending ? "Pridávam..." : "Pridať do košíka"}
      </button>

      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}
