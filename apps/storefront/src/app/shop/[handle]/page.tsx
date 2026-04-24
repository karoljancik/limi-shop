import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductZoomImage } from "@/components/product-zoom-image";
import {
  formatPrice,
  getProductByHandle,
  getProductCollectionImages,
  getProductImageSrc,
  getProductInfo,
} from "@/lib/medusa";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const variant = product.variants[0];
  const productInfo = getProductInfo(product.handle);
  const collectionImages = getProductCollectionImages(product.handle);
  const orderedCollectionImages = [...collectionImages].sort(
    (left, right) => Number(right.featured) - Number(left.featured)
  );

  const isOutOfStock =
    variant?.manage_inventory && (variant?.inventory_quantity ?? 0) <= 0 && !variant?.allow_backorder;

  const stockLabel = isOutOfStock
    ? "Nie je na sklade"
    : variant?.manage_inventory
      ? `Skladom (${variant.inventory_quantity} ks)`
      : "Skladom";

  return (
    <div className="page-shell py-10 md:py-14">
      <Link href="/shop" className="text-sm font-medium text-[var(--muted)]">
        ← Späť do obchodu
      </Link>

      <div className="mt-6 grid items-start gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <div className="card overflow-hidden p-4">
          <ProductZoomImage
            src={getProductImageSrc(product) ?? "https://placehold.co/1200x1600/eee/111?text=LIMI"}
            alt={product.title}
            width={1200}
            height={1600}
            priority
            className="h-[520px] w-full rounded-[1.25rem] object-cover"
          />
        </div>

        <div className="space-y-6">
          <p className="eyebrow">Detail produktu</p>
          <div className="product-detail__headline">
            <span className="product-detail__badge">{productInfo.badge}</span>
            <h1 className="text-4xl font-black leading-tight">{product.title}</h1>
          </div>
          <p className="text-2xl font-semibold">
            {formatPrice(
              variant?.calculated_price?.calculated_amount ?? 0,
              variant?.calculated_price?.currency_code ?? "eur"
            )}
          </p>

          <div className="product-info-card">
            <div className="product-info-card__row">
              <span className="product-info-card__label">Dostupnosť</span>
              <span
                className={`product-info-card__value ${
                  isOutOfStock ? "font-bold text-red-500" : "text-green-600"
                }`}
              >
                {stockLabel}
              </span>
            </div>
            <div className="product-info-card__row">
              <span className="product-info-card__label">Katalógové číslo</span>
              <span className="product-info-card__value">{productInfo.catalogNumber}</span>
            </div>
            <div className="product-info-card__row">
              <span className="product-info-card__label">Kategória</span>
              <span className="product-info-card__value">{productInfo.category}</span>
            </div>
          </div>

          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">{product.description}</p>

          <div className="product-detail__actions">
            {variant ? (
              <AddToCartButton variantId={variant.id} outOfStock={isOutOfStock} />
            ) : null}
            <a href="#info" className="btn-soft">
              Viac o nálepke
            </a>
          </div>
        </div>
      </div>

      <section id="info" className="product-story mt-10 md:mt-14">
        <div className="product-story__tabs">
          <a href="#info" className="product-story__tab is-active">
            Popis
          </a>
          {collectionImages.length > 0 ? (
            <a href="#gallery" className="product-story__tab">
              Galéria kolekcie
            </a>
          ) : null}
        </div>

        <div className="product-story__grid">
          <div className="card product-story__copy">
            <p className="product-story__lead">{productInfo.description}</p>
            <p className="text-base leading-8 text-[var(--muted)]">
              {product.description} LIMI nálepky sú navrhnuté tak, aby deti bavili, rozvíjali ich
              fantáziu a prinášali pokojné spoločné chvíle pri tvorení.
            </p>
          </div>

          <div className="card product-story__facts">
            <div>
              <p className="eyebrow">Prečo si ich obľúbiť</p>
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
                <p className="eyebrow">Galéria kolekcie</p>
                <h2 className="product-gallery__title">Ako vyzerá sada po rozložení</h2>
              </div>
              <p className="product-gallery__text">
                Hlavná fotka produktu ostáva bez zmeny a tu nižšie nájdeš ešte detailnejší pohľad
                na motív a rozloženie dielikov v sade.
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

