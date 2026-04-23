import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatPrice, getProductByHandle } from "@/lib/medusa";

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

  return (
    <div className="page-shell py-10 md:py-14">
      <Link href="/shop" className="text-sm font-medium text-[var(--muted)]">
        ← Spat do shopu
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <div className="card overflow-hidden p-4">
          <Image
            src={product.thumbnail ?? "https://placehold.co/1200x1600/eee/111?text=LIMI"}
            alt={product.title}
            width={1200}
            height={1600}
            className="h-[520px] w-full rounded-[1.25rem] object-cover"
          />
        </div>

        <div className="space-y-6">
          <p className="eyebrow">Detail produktu</p>
          <h1 className="text-4xl font-black leading-tight">{product.title}</h1>
          <p className="text-2xl font-semibold">
            {formatPrice(
              variant?.calculated_price?.calculated_amount ?? 0,
              variant?.calculated_price?.currency_code ?? "eur"
            )}
          </p>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
            {product.description}
          </p>
          {variant ? <AddToCartButton variantId={variant.id} /> : null}
        </div>
      </div>
    </div>
  );
}
