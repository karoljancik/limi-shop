import { CartSummary } from "@/components/cart-summary";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function CartPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="page-shell py-10 md:py-14">
      <div className="mb-8 space-y-3">
        <p className="eyebrow">{dict.nav.cart}</p>
        <h1 className="text-4xl font-black">{dict.cart.title}</h1>
        <p className="max-w-2xl text-[var(--muted)]">
          {lang === "en" 
            ? "Review your selected products, fill in the address and complete the order via bank transfer."
            : "Skontroluj si vybrané produkty, doplň adresu a dokonč objednávku bankovým prevodom."}
        </p>
      </div>

      <CartSummary locale={lang} />
    </div>
  );
}
