import { CartSummary } from "@/components/cart-summary";

export default function CartPage() {
  return (
    <div className="page-shell py-10 md:py-14">
      <div className="mb-8 space-y-3">
        <p className="eyebrow">Košík</p>
        <h1 className="text-4xl font-black">Tvoj výber</h1>
        <p className="max-w-2xl text-[var(--muted)]">
          Skontroluj si vybrané produkty a pokračuj ďalej.
        </p>
      </div>

      <CartSummary />
    </div>
  );
}
