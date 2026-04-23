"use client";

import { useState, useTransition } from "react";
import { addVariantToCart } from "@/lib/cart-client";

export function AddToCartButton({ variantId }: { variantId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        className="btn-primary"
        data-testid="add-to-cart"
        onClick={() => {
          startTransition(async () => {
            try {
              await addVariantToCart(variantId);
              setMessage("Produkt bol pridaný do košíka.");
            } catch {
              setMessage("Nepodarilo sa pridať produkt do košíka.");
            }
          });
        }}
        disabled={isPending}
      >
        {isPending ? "Pridávam..." : "Pridať do košíka"}
      </button>
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}
