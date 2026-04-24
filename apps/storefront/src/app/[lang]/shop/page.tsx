import Image from "next/image";
import Link from "next/link";
import { formatPrice, getProductImageSrc, getProductTranslation, listProducts } from "@/lib/medusa";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const products = await listProducts();

  const eyebrow = lang === "en" ? "Shop" : "Obchod";
  const title = lang === "en" ? "Limi Shop" : "Limi obchod";
  const description = lang === "en" 
    ? "Choose a sticker that draws children into play and brings peaceful creative moments to parents."
    : "Vyber si nálepku, ktorá deti vtiahne do hry a rodičom prinesie pokojné tvorivé chvíle.";
  
  const soldOutLabel = lang === "en" ? "Sold Out" : "Vypredané";
  const moreInfoLabel = lang === "en" ? "More about the sticker" : "Viac o nálepke";

  return (
    <div className="page-shell py-10 md:py-14">
      <div className="mb-8 space-y-3">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="text-4xl font-black">{title}</h1>
        <p className="max-w-2xl text-[var(--muted)]">
          {description}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => {
          const translation = getProductTranslation(product.handle, lang);
          const title = translation?.title ?? product.title;
          const description = translation?.description ?? product.description;

          return (
            <div
              key={product.id}
              className="card flex h-full flex-col overflow-hidden"
              data-testid="product-card"
            >
              <Link href={`/${lang}/shop/${product.handle}`} className="relative block">
                <Image
                  src={getProductImageSrc(product) ?? "https://placehold.co/1200x1600/eee/111?text=LIMI"}
                  alt={title}
                  width={1200}
                  height={1600}
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  unoptimized
                  className="h-80 w-full object-cover"
                />
                {product.variants[0]?.manage_inventory &&
                  (product.variants[0]?.inventory_quantity ?? 0) <= 0 &&
                  !product.variants[0]?.allow_backorder && (
                    <div className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-xl ring-2 ring-white/20 backdrop-blur-sm">
                      {soldOutLabel}
                    </div>
                  )}
              </Link>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <Link href={`/${lang}/shop/${product.handle}`}>
                  <h2 className="text-xl font-bold">{title}</h2>
                </Link>
                <p className="line-clamp-3 text-sm leading-6 text-[var(--muted)]">
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
                    {moreInfoLabel}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
