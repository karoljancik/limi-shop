import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import {
  formatPrice,
  getProductByHandle,
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

      <div className="mt-6 grid gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <div className="card overflow-hidden p-4">
          <Image
            src={getProductImageSrc(product) ?? "https://placehold.co/1200x1600/eee/111?text=LIMI"}
            alt={product.title}
            width={1200}
            height={1600}
            loading="eager"
            unoptimized
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

          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
            {product.description}
          </p>

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
          <span className="product-story__tab is-active">Popis</span>
          <span className="product-story__tab">Čo v nej nájdeš</span>
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

            <div>
              <p className="eyebrow">V balení nájdeš</p>
              <ul className="product-story__list">
                {productInfo.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
