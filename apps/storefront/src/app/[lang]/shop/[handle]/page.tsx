import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductZoomImage } from "@/components/product-zoom-image";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  formatPrice,
  getProductByHandle,
  getProductCollectionImages,
  getProductImageSrc,
  getProductInfo,
  getProductTranslation,
} from "@/lib/medusa";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string; lang: string }>;
}) {
  const { handle, lang } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const variant = product.variants[0];
  const productInfo = getProductInfo(product.handle, lang);
  const translation = getProductTranslation(product.handle, lang);
  const title = translation?.title ?? product.title;
  const description = translation?.description ?? product.description;
  const collectionImages = getProductCollectionImages(product.handle, lang);
  const orderedCollectionImages = [...collectionImages].sort(
    (left, right) => Number(right.featured) - Number(left.featured)
  );

  const isOutOfStock =
    variant?.manage_inventory && (variant?.inventory_quantity ?? 0) <= 0 && !variant?.allow_backorder;

  const stockStatusLabel = lang === "en" ? "Availability" : "Dostupnosť";
  const catNumberLabel = lang === "en" ? "Catalog Number" : "Katalógové číslo";
  const categoryLabel = lang === "en" ? "Category" : "Kategória";
  
  const stockLabel = isOutOfStock
    ? (lang === "en" ? "Out of stock" : "Nie je na sklade")
    : variant?.manage_inventory
      ? (lang === "en" ? `In stock (${variant.inventory_quantity} pcs)` : `Skladom (${variant.inventory_quantity} ks)`)
      : (lang === "en" ? "In stock" : "Skladom");

  const backLinkText = lang === "en" ? "← Back to shop" : "← Späť do obchodu";
  const detailEyebrow = lang === "en" ? "Product Detail" : "Detail produktu";
  const aboutText = lang === "en" ? "More about the sticker" : "Viac o nálepke";
  const whyLoveTitle = lang === "en" ? "Why to love them" : "Prečo si ich obľúbiť";
  const galleryTitle = lang === "en" ? "Collection Gallery" : "Galéria kolekcie";
  const gallerySubtitle = lang === "en" ? "How the set looks when unfolded" : "Ako vyzerá sada po rozložení";
  const galleryText = lang === "en" 
    ? "The main product photo remains unchanged and here below you'll find an even more detailed look at the motif and distribution of pieces in the set."
    : "Hlavná fotka produktu ostáva bez zmeny a tu nižšie nájdeš ešte detailnejší pohľad na motív a rozloženie dielikov v sade.";

  return (
    <div className="page-shell py-10 md:py-14">
      <Link href={`/${lang}/shop`} className="text-sm font-medium text-[var(--muted)]">
        {backLinkText}
      </Link>

      <div className="mt-6 grid items-start gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <div className="card overflow-hidden p-4">
          <ProductZoomImage
            src={getProductImageSrc(product) ?? "https://placehold.co/1200x1600/eee/111?text=LIMI"}
            alt={title}
            width={1200}
            height={1600}
            priority
            className="h-[520px] w-full rounded-[1.25rem] object-cover"
          />
        </div>

        <div className="space-y-6">
          <p className="eyebrow">{detailEyebrow}</p>
          <div className="product-detail__headline">
            <span className="product-detail__badge">{productInfo.badge}</span>
            <h1 className="text-4xl font-black leading-tight">{title}</h1>
          </div>
          <p className="text-2xl font-semibold">
            {formatPrice(
              variant?.calculated_price?.calculated_amount ?? 0,
              variant?.calculated_price?.currency_code ?? "eur",
              lang
            )}
          </p>

          <div className="product-info-card">
            <div className="product-info-card__row">
              <span className="product-info-card__label">{stockStatusLabel}</span>
              <span
                className={`product-info-card__value ${
                  isOutOfStock ? "font-bold text-red-500" : "text-green-600"
                }`}
              >
                {stockLabel}
              </span>
            </div>
            <div className="product-info-card__row">
              <span className="product-info-card__label">{catNumberLabel}</span>
              <span className="product-info-card__value">{productInfo.catalogNumber}</span>
            </div>
            <div className="product-info-card__row">
              <span className="product-info-card__label">{categoryLabel}</span>
              <span className="product-info-card__value">{productInfo.category}</span>
            </div>
          </div>

          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">{description}</p>

          <div className="product-detail__actions">
            {variant ? (
              <AddToCartButton variantId={variant.id} outOfStock={isOutOfStock} locale={lang} />
            ) : null}
            <a href="#info" className="btn-soft">
              {aboutText}
            </a>
          </div>
        </div>
      </div>

      <section id="info" className="product-story mt-10 md:mt-14">
        <div className="product-story__tabs">
          <a href="#info" className="product-story__tab is-active">
            {lang === "en" ? "Description" : "Popis"}
          </a>
          {collectionImages.length > 0 ? (
            <a href="#gallery" className="product-story__tab">
              {lang === "en" ? "Collection Gallery" : "Galéria kolekcie"}
            </a>
          ) : null}
        </div>

        <div className="product-story__grid">
          <div className="card product-story__copy">
            <p className="product-story__lead">{productInfo.description}</p>
            <p className="text-base leading-8 text-[var(--muted)]">
              {description} {lang === "en" 
                ? "LIMI stickers are designed to entertain children, develop their imagination and bring peaceful shared moments during creation."
                : "LIMI nálepky sú navrhnuté tak, aby deti bavili, rozvíjali ich fantáziu a prinášali pokojné spoločné chvíle pri tvorení."
              }
            </p>
          </div>

          <div className="card product-story__facts">
            <div>
              <p className="eyebrow">{whyLoveTitle}</p>
              <ul className="product-story__list">
                {productInfo.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {collectionImages.length > 0 ? (
          <div id="gallery" className="card product-gallery">
            <div className="product-gallery__intro">
              <div>
                <p className="eyebrow">{galleryTitle}</p>
                <h2 className="product-gallery__title">{gallerySubtitle}</h2>
              </div>
              <p className="product-gallery__text">
                {galleryText}
              </p>
            </div>

            <div className="product-gallery__grid">
              {orderedCollectionImages.map((image) => (
                <figure
                  key={image.src}
                  className={`product-gallery__item ${image.featured ? "is-featured" : ""}`}
                >
                  <ProductZoomImage
                    src={image.src}
                    alt={image.alt}
                    width={image.featured ? 1200 : 800}
                    height={image.featured ? 1200 : 800}
                    className="product-gallery__image"
                  />
                  <figcaption className="product-gallery__caption">{image.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
