import Image from "next/image";
import Link from "next/link";
import { formatPrice, getProductImageSrc, listProducts } from "@/lib/medusa";

export default async function Home() {
  const products = await listProducts();
  const featured = products.slice(0, 3);

  return (
    <div className="space-y-16 py-10 md:py-16">
      <section className="page-shell">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-6">
            <p className="eyebrow">Limi nálepky</p>
            <h1 className="max-w-3xl text-5xl font-black leading-none tracking-tight md:text-7xl">
              Nálepky, ktoré pozývajú do sveta malých príbehov.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Jemné farby, milé motívy a tvorenie, pri ktorom si oddýchnu deti aj rodičia.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary">
                Objaviť nálepky
              </Link>
              <Link href="/kosik" className="btn-secondary">
                Pozrieť košík
              </Link>
            </div>
          </div>
          <div className="card overflow-hidden p-4">
            <video
              className="h-[420px] w-full rounded-[1.25rem] object-cover"
              src="/video/brand/Videoweb-web.mp4"
              poster="/video/brand/frame0.jpg"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              preload="auto"
            />
          </div>
        </div>
      </section>

      <section className="page-shell space-y-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Vybrané produkty</p>
            <h2 className="mt-2 text-3xl font-black">Malé svety na objavenie</h2>
          </div>
          <Link href="/shop" className="btn-secondary">
            Všetky produkty
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((product) => (
            <div
              key={product.id}
              className="card flex h-full flex-col overflow-hidden"
              data-testid="featured-product"
            >
              <Link href={`/shop/${product.handle}`}>
                <Image
                  src={getProductImageSrc(product) ?? "https://placehold.co/1200x1600/eee/111?text=LIMI"}
                  alt={product.title}
                  width={1200}
                  height={1600}
                  unoptimized
                  className="h-72 w-full object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <Link href={`/shop/${product.handle}`}>
                  <h3 className="text-xl font-bold">{product.title}</h3>
                </Link>
                <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">
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
      </section>
    </div>
  );
}
