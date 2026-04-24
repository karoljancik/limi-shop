"use client";

import { useState, useTransition } from "react";
import { addVariantToCart } from "@/lib/cart-client";
import { useCart } from "@/components/cart-provider";

export function AddToCartButton({
  variantId,
  disabled = false,
  outOfStock = false,
  locale = "sk",
}: {
  variantId: string;
  disabled?: boolean;
  outOfStock?: boolean;
  locale?: string;
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
          {locale === "en" ? "Sold Out" : "Vypredané"}
        </button>
        <p className="text-sm text-red-500 font-medium">
          {locale === "en" ? "This product is currently unavailable." : "Tento produkt momentálne nie je k dispozícii."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center overflow-hidden rounded-full border border-[var(--line)] bg-white/90 shadow-[0_8px_16px_rgba(194,159,198,0.12)]">
            <button
              type="button"
              className="h-10 w-10 text-lg font-semibold text-[var(--foreground)] transition hover:bg-[rgba(241,196,206,0.24)] disabled:opacity-50"
              aria-label={locale === "en" ? "Decrease quantity" : "Znížiť počet kusov"}
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
              className="h-10 w-14 border-x border-[var(--line)] bg-transparent px-2 text-center font-semibold outline-none"
              value={normalizedQuantity}
              onChange={(event) => {
                const nextValue = Number.parseInt(event.target.value, 10);
                setQuantity(Number.isNaN(nextValue) ? 1 : nextValue);
              }}
              disabled={isPending || disabled}
            />
            <button
              type="button"
              className="h-10 w-10 text-lg font-semibold text-[var(--foreground)] transition hover:bg-[rgba(241,196,206,0.24)] disabled:opacity-50"
              aria-label={locale === "en" ? "Increase quantity" : "Zvýšiť počet kusov"}
              onClick={() => {
                setQuantity((current) => Math.min(99, current + 1));
              }}
              disabled={isPending || disabled || normalizedQuantity >= 99}
            >
              +
            </button>
          </div>
          <span className="text-sm font-semibold text-[var(--muted)]">
            {locale === "en" ? "pcs" : "ks"}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="btn-primary w-full md:w-fit px-8"
        data-testid="add-to-cart"
        onClick={() => {
          startTransition(async () => {
            try {
              await addVariantToCart(variantId, normalizedQuantity);
              await refreshCart();
              if (locale === "en") {
                setMessage(
                  normalizedQuantity === 1
                    ? "Product was added to the cart."
                    : `${normalizedQuantity} pcs were added to the cart.`
                );
              } else {
                setMessage(
                  normalizedQuantity === 1
                    ? "Produkt bol pridaný do košíka."
                    : `${normalizedQuantity} ks boli pridané do košíka.`
                );
              }
            } catch {
              setMessage(locale === "en" ? "Failed to add product to cart." : "Nepodarilo sa pridať produkt do košíka.");
            }
          });
        }}
        disabled={isPending || disabled}
      >
        {isPending ? (locale === "en" ? "Adding..." : "Pridávam...") : (locale === "en" ? "Add to cart" : "Pridat do košíka")}
      </button>

      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}
