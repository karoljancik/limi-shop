import { CartSummary } from "@/components/cart-summary";

export default function CartPage() {
  return (
    <div className="page-shell py-10 md:py-14">
      <div className="mb-8 space-y-3">
        <p className="eyebrow">Kosik</p>
        <h1 className="text-4xl font-black">Tvoj vyber</h1>
        <p className="max-w-2xl text-[var(--muted)]">
          Skontroluj si vybrane produkty, dopln adresu a dokonc objednavku bankovym prevodom.
        </p>
      </div>

      <CartSummary />
    </div>
  );
}
