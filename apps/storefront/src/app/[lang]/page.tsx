import Image from "next/image";
import Link from "next/link";
import { formatPrice, getProductImageSrc, getProductTranslation, listProducts } from "@/lib/medusa";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const products = await listProducts();
  const featured = products.slice(0, 3);

  return (
    <div className="space-y-16 py-10 md:py-16">
      <section className="page-shell">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-6">
            <p className="eyebrow">{dict.home.hero.eyebrow}</p>
            <h1 className="max-w-3xl text-5xl font-black leading-none tracking-tight md:text-7xl">
              {dict.home.hero.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
              {dict.home.hero.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/${lang}/shop`} className="btn-primary">
                {dict.home.hero.cta_shop}
              </Link>
              <Link href={`/${lang}/cart`} className="btn-secondary">
                {dict.home.hero.cta_cart}
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
            <p className="eyebrow">{dict.home.featured.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-black">{dict.home.featured.title}</h2>
          </div>
          <Link href={`/${lang}/shop`} className="btn-secondary">
            {dict.home.featured.all_products}
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((product, index) => {
            const translation = getProductTranslation(product.handle, lang);
            const title = translation?.title ?? product.title;
            const description = translation?.description ?? product.description;

            return (
              <div
                key={product.id}
                className="card flex h-full flex-col overflow-hidden"
                data-testid="featured-product"
              >
                <Link href={`/${lang}/shop/${product.handle}`}>
                  <Image
                    src={getProductImageSrc(product) ?? "https://placehold.co/1200x1600/eee/111?text=LIMI"}
                    alt={title}
                    width={1200}
                    height={1600}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    unoptimized
                    className="h-72 w-full object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <Link href={`/${lang}/shop/${product.handle}`}>
                    <h3 className="text-xl font-bold">{title}</h3>
                  </Link>
                  <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                    {description}
                  </p>
                  <div className="product-card__footer">
                    <p className="text-lg font-semibold">
                      {formatPrice(
                        product.variants[0]?.calculated_price?.calculated_amount ?? 0,
                        product.variants[0]?.calculated_price?.currency_code ?? "eur",
                        lang
                      )}
                    </p>
                    <Link href={`/${lang}/shop/${product.handle}#info`} className="product-card__info-link">
                      {dict.home.featured.more_info}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
