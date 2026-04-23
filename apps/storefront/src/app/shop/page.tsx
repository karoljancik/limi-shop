import Image from "next/image";
import Link from "next/link";
import { formatPrice, listProducts } from "@/lib/medusa";

export default async function ShopPage() {
  const products = await listProducts();

  return (
    <div className="page-shell py-10 md:py-14">
      <div className="mb-8 space-y-3">
        <p className="eyebrow">Obchod</p>
        <h1 className="text-4xl font-black">Limi obchod</h1>
        <p className="max-w-2xl text-[var(--muted)]">
          Vyber si nálepky, ktoré potešia malé ruky aj veľkú fantáziu.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.handle}`}
            className="card overflow-hidden"
            data-testid="product-card"
          >
            <Image
              src={product.thumbnail ?? "https://placehold.co/1200x1600/eee/111?text=LIMI"}
              alt={product.title}
              width={1200}
              height={1600}
              className="h-80 w-full object-cover"
            />
            <div className="space-y-3 p-5">
              <h2 className="text-xl font-bold">{product.title}</h2>
              <p className="line-clamp-3 text-sm leading-6 text-[var(--muted)]">
                {product.description}
              </p>
              <p className="text-lg font-semibold">
                {formatPrice(
                  product.variants[0]?.calculated_price?.calculated_amount ?? 0,
                  product.variants[0]?.calculated_price?.currency_code ?? "eur"
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
