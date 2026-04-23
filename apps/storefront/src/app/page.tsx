import Image from "next/image";
import Link from "next/link";
import { formatPrice, listProducts } from "@/lib/medusa";

export default async function Home() {
  const products = await listProducts();
  const featured = products.slice(0, 3);

  return (
    <div className="space-y-16 py-10 md:py-16">
      <section className="page-shell">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-6">
            <p className="eyebrow">Limi stickers</p>
            <h1 className="max-w-3xl text-5xl font-black leading-none tracking-tight md:text-7xl">
              3D zazitkove nalepky pre pokojne tvorenie.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Headless storefront nad Medusou. Produkty uz bezia z vlastnej
              databazy a frontend je pripraveny na dalsi rast.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary">
                Otvorit obchod
              </Link>
              <Link href="/kosik" className="btn-secondary">
                Pozriet kosik
              </Link>
            </div>
          </div>
          <div className="card overflow-hidden p-4">
            <Image
              src={featured[0]?.thumbnail ?? "https://placehold.co/1200x1600/f7ecb5/1f2937?text=LIMI"}
              alt={featured[0]?.title ?? "Limi"}
              width={1200}
              height={1600}
              className="h-[420px] w-full rounded-[1.25rem] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="page-shell space-y-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Vybrane produkty</p>
            <h2 className="mt-2 text-3xl font-black">Prve Medusa produkty</h2>
          </div>
          <Link href="/shop" className="btn-secondary">
            Vsetky produkty
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.handle}`}
              className="card overflow-hidden"
              data-testid="featured-product"
            >
              <Image
                src={product.thumbnail ?? "https://placehold.co/1200x1600/eee/111?text=LIMI"}
                alt={product.title}
                width={1200}
                height={1600}
                className="h-72 w-full object-cover"
              />
              <div className="space-y-3 p-5">
                <h3 className="text-xl font-bold">{product.title}</h3>
                <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">
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
      </section>
    </div>
  );
}
