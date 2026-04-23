import Image from "next/image";
import Link from "next/link";
import { formatPrice, getProductImageSrc, listProducts } from "@/lib/medusa";

export default async function ShopPage() {
  const products = await listProducts();

  return (
    <div className="page-shell py-10 md:py-14">
      <div className="mb-8 space-y-3">
        <p className="eyebrow">Obchod</p>
        <h1 className="text-4xl font-black">Limi obchod</h1>
        <p className="max-w-2xl text-[var(--muted)]">
          Vyber si nálepku, ktorá deti vtiahne do hry a rodičom prinesie pokojné tvorivé chvíle.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="card flex h-full flex-col overflow-hidden"
            data-testid="product-card"
          >
            <Link href={`/shop/${product.handle}`}>
              <Image
                src={getProductImageSrc(product) ?? "https://placehold.co/1200x1600/eee/111?text=LIMI"}
                alt={product.title}
                width={1200}
                height={1600}
                loading={index === 0 ? "eager" : undefined}
                unoptimized
                className="h-80 w-full object-cover"
              />
            </Link>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <Link href={`/shop/${product.handle}`}>
                <h2 className="text-xl font-bold">{product.title}</h2>
              </Link>
              <p className="line-clamp-3 text-sm leading-6 text-[var(--muted)]">
                {product.description}
              </p>
              <div className="product-card__footer">
                <p className="text-lg font-semibold">
                  {formatPrice(
                    product.variants[0]?.calculated_price?.calculated_amount ?? 0,
                    product.variants[0]?.calculated_price?.currency_code ?? "eur"
                  )}
                </p>
                <Link href={`/shop/${product.handle}#info`} className="product-card__info-link">
                  Viac o nálepke
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
