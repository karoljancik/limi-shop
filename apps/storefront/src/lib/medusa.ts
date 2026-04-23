const publicBackendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
const internalBackendUrl =
  process.env.MEDUSA_BACKEND_URL ?? publicBackendUrl;
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

if (!publicBackendUrl) {
  throw new Error("Missing NEXT_PUBLIC_MEDUSA_BACKEND_URL");
}

if (!internalBackendUrl) {
  throw new Error("Missing MEDUSA_BACKEND_URL");
}

if (!publishableKey) {
  throw new Error("Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY");
}

export const MEDUSA_BACKEND_URL = publicBackendUrl;
export const MEDUSA_PUBLISHABLE_KEY = publishableKey;
export const MEDUSA_REGION_ID = "reg_01KPTPPA2PM6ZEYJYHE5W8FYN0";
export const MEDUSA_SALES_CHANNEL_ID = "sc_01KPTPP9VMXHMEHYKAJJT6SXYS";

function getMedusaBaseUrl() {
  return typeof window === "undefined" ? internalBackendUrl : publicBackendUrl;
}

export type StoreProduct = {
  id: string;
  title: string;
  description: string;
  handle: string;
  thumbnail: string | null;
  variants: Array<{
    id: string;
    title: string;
    calculated_price?: {
      calculated_amount: number;
      currency_code: string;
    };
  }>;
};

export type StoreCart = {
  id: string;
  total: number;
  subtotal: number;
  currency_code: string;
  items: Array<{
    id: string;
    quantity: number;
    product_title: string;
    product_handle: string;
    thumbnail: string | null;
    unit_price: number;
    variant_id: string;
  }>;
};

async function medusaFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getMedusaBaseUrl()}${path}`, {
    ...init,
    headers: {
      "x-publishable-api-key": MEDUSA_PUBLISHABLE_KEY,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Medusa request failed: ${response.status} ${text}`);
  }

  return response.json() as Promise<T>;
}

export function formatPrice(amount: number, currencyCode = "eur") {
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100);
}

export async function listProducts() {
  const data = await medusaFetch<{ products: StoreProduct[] }>(
    `/store/products?limit=20&region_id=${MEDUSA_REGION_ID}`
  );

  return data.products;
}

export async function getProductByHandle(handle: string) {
  const data = await medusaFetch<{ products: StoreProduct[] }>(
    `/store/products?handle[0]=${encodeURIComponent(handle)}&region_id=${MEDUSA_REGION_ID}`
  );

  return data.products[0] ?? null;
}

export async function createCart() {
  const data = await medusaFetch<{ cart: StoreCart }>("/store/carts", {
    method: "POST",
    body: JSON.stringify({
      region_id: MEDUSA_REGION_ID,
      sales_channel_id: MEDUSA_SALES_CHANNEL_ID,
    }),
  });

  return data.cart;
}

export async function getCart(cartId: string) {
  const data = await medusaFetch<{ cart: StoreCart }>(`/store/carts/${cartId}`);
  return data.cart;
}

export async function addLineItem(cartId: string, variantId: string, quantity = 1) {
  const data = await medusaFetch<{ cart: StoreCart }>(
    `/store/carts/${cartId}/line-items`,
    {
      method: "POST",
      body: JSON.stringify({
        variant_id: variantId,
        quantity,
      }),
    }
  );

  return data.cart;
}
