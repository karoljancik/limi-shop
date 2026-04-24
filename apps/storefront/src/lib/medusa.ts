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
const PRODUCT_IMAGE_BY_HANDLE: Record<string, string> = {
  "kapi-kupelne-nalepky-limi": "/products/stickers/limi_capy_wellness.jpg",
  "mackova-pekaren-nalepky-limi": "/products/stickers/limi_bear_bakery.jpg",
  "piggy-obchod-nalepky-limi": "/products/stickers/limi_piggy_store.jpg",
  "vianocne-nalepky-limi": "/products/stickers/limi_christmas_stick.jpg",
  "mystery-nalepky-limi": "/products/stickers/limi_mystery_stick.jpg",
  "pinzeta-limi": "/products/stickers/pinzety_limi.jpg",
};

const PRODUCT_INFO_BY_HANDLE = {
  "kapi-kupelne-nalepky-limi": {
    category: "3D nálepky",
    stockLabel: "Skladom online",
    badge: "Obľúbené",
    catalogNumber: "LIMI-BATH-001",
    description:
      "Kúpeľný svet plný milých detailov pozýva deti objavovať, lepiť a vytvárať si vlastný malý príbeh.",
    highlights: [
      "podporuje jemnú motoriku a trpezlivosť",
      "pokojné tvorenie bez zhonu a obrazoviek",
      "jemné farby, ktoré si deti rýchlo obľúbia",
    ],
    includes: ["3D nálepkové dieliky", "ilustrované pozadie", "mini príbeh pre detskú fantáziu"],
  },
  "mackova-pekaren-nalepky-limi": {
    category: "3D nálepky",
    stockLabel: "Skladom online",
    badge: "Sladká novinka",
    catalogNumber: "LIMI-FRAME-002",
    description:
      "Mačkova pekáreň vonia po koláčikoch, hre a tvorení. Deti si pri nej skladajú vlastný sladký príbeh plný detailov.",
    highlights: [
      "sladká téma, ktorú si deti zamilujú na prvý pohľad",
      "rozvíja pozornosť a jemnú motoriku",
      "krásny darček na tvorivé popoludnie",
    ],
    includes: ["samolepkové vrstvy", "podkladová ilustrácia", "detaily na dotvorenie scény"],
  },
  "piggy-obchod-nalepky-limi": {
    category: "3D nálepky",
    stockLabel: "Skladom online",
    badge: "Hravé",
    catalogNumber: "LIMI-SHOP-003",
    description:
      "Piggy obchod je veselá sada, v ktorej si deti vytvoria vlastný mini obchodík a vymyslia si hru po svojom.",
    highlights: [
      "veselá scénka na hru a fantáziu",
      "zábavné lepenie malých detailov",
      "farebný dizajn, ktorý rozžiari tvorivý kútik",
    ],
    includes: ["3D vrstvy", "hlavná scéna", "ilustrované doplnky"],
  },
  "vianocne-nalepky-limi": {
    category: "3D nálepky",
    stockLabel: "Sezónna kolekcia",
    badge: "Vianoce",
    catalogNumber: "LIMI-XMAS-004",
    description:
      "Vianočná sada prináša teplú sviatočnú atmosféru, jemné tvorenie a chvíle, pri ktorých sa spomalí celý deň.",
    highlights: [
      "ideálne na adventné tvorenie doma",
      "sviatočná nálada bez zbytočného chaosu",
      "milý doplnok k zimným tvorivým aktivitám",
    ],
    includes: ["tematické 3D nálepky", "zimná scéna", "drobné sviatočné detaily"],
  },
  "mystery-nalepky-limi": {
    category: "Mystery nálepky",
    stockLabel: "Prekvapenie v balení",
    badge: "Mystery",
    catalogNumber: "LIMI-MYST-005",
    description:
      "Mystery nálepka je malé prekvapenie, ktoré rozžiari oči aj fantáziu. Stačí otvoriť a objaviť, čo sa skrýva vo vnútri.",
    highlights: [
      "prekvapenie, ktoré baví deti aj dospelých",
      "skvelá drobnosť ako darček navyše",
      "rýchla radosť z tvorenia aj objavovania",
    ],
    includes: ["mystery motív", "nálepkové prvky", "mini scéna alebo doplnok"],
  },
  "pinzeta-limi": {
    category: "Doplnky",
    stockLabel: "Pomôcka skladom",
    badge: "Doplnok",
    catalogNumber: "LIMI-TOOL-006",
    description:
      "Pinzeta LIMI pomáha pri lepení maličkých detailov a robí tvorenie ešte pohodlnejším a presnejším.",
    highlights: [
      "uľahčuje prácu s drobnými dielikmi",
      "vhodná k nálepkám aj detailnému tvoreniu",
      "praktický pomocník ku každej sade",
    ],
    includes: ["pinzeta na jemné uchopenie"],
  },
} as const;

const PRODUCT_COLLECTION_IMAGES_BY_HANDLE = {
  "kapi-kupelne-nalepky-limi": [
    {
      src: "/products/collections/limi_capy_wellness/capy_wellness.png",
      alt: "LIMI Kapi wellness kolekcia",
      caption: "Plný motív kolekcie",
      featured: false,
    },
    {
      src: "/products/collections/limi_capy_wellness/capy_wellness_overview.jpeg",
      alt: "LIMI Kapi wellness prehľad dielikov",
      caption: "Prehľad scény a dielikov",
      featured: true,
    },
  ],
  "mackova-pekaren-nalepky-limi": [
    {
      src: "/products/collections/limi_bear_bakery/bear_bakery.png",
      alt: "LIMI Mačkova pekáreň kolekcia",
      caption: "Plný motív kolekcie",
      featured: false,
    },
    {
      src: "/products/collections/limi_bear_bakery/bear_bakery_overview.jpeg",
      alt: "LIMI Mačkova pekáreň prehľad dielikov",
      caption: "Prehľad scény a dielikov",
      featured: true,
    },
  ],
  "piggy-obchod-nalepky-limi": [
    {
      src: "/products/collections/limi_piggy_store/piggy_store.png",
      alt: "LIMI Piggy obchod kolekcia",
      caption: "Plný motív kolekcie",
      featured: false,
    },
    {
      src: "/products/collections/limi_piggy_store/piggy_store_overview.jpeg",
      alt: "LIMI Piggy obchod prehľad dielikov",
      caption: "Prehľad scény a dielikov",
      featured: true,
    },
  ],
} as const;

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
    inventory_quantity?: number;
    manage_inventory?: boolean;
    allow_backorder?: boolean;
    calculated_price?: {
      calculated_amount: number;
      currency_code: string;
    };
  }>;
};

export type ProductInfo = {
  badge: string;
  catalogNumber: string;
  category: string;
  description: string;
  highlights: readonly string[];
  includes: readonly string[];
  stockLabel: string;
};

export type ProductCollectionImage = {
  alt: string;
  caption: string;
  featured: boolean;
  src: string;
};

type StoreContext = {
  store: {
    id: string;
    name: string;
    default_sales_channel_id: string | null;
  } | null;
  region: {
    id: string;
    name: string;
    currency_code: string;
  } | null;
};

export type AddressInput = {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  postal_code: string;
  country_code: string;
  phone: string;
};

export type StoreCart = {
  id: string;
  total: number;
  subtotal: number;
  currency_code: string;
  email?: string | null;
  payment_collection?: {
    id: string;
  } | null;
  shipping_methods?: Array<{
    id: string;
    shipping_option_id?: string | null;
    amount: number;
    name?: string | null;
  }>;
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

export type StoreShippingOption = {
  id: string;
  name: string;
  amount: number;
  price_type: string;
  provider_id: string;
  type?: {
    label?: string | null;
    description?: string | null;
    code?: string | null;
  } | null;
};

export type StorePaymentProvider = {
  id: string;
  is_enabled: boolean;
};

export type StorePaymentCollection = {
  id: string;
  payment_sessions?: Array<{
    id: string;
    provider_id: string;
  }>;
};

export type StoreOrder = {
  id: string;
  display_id: number;
  email: string;
  total: number;
  currency_code: string;
};

export type CheckoutNotificationResponse = {
  bank_transfer: {
    account_name: string;
    bank_name: string;
    iban: string;
    swift: string;
    payment_reference: string;
  };
  email_sent: boolean;
  message: string;
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

let storeContextPromise: Promise<StoreContext> | null = null;

async function getStoreContext() {
  storeContextPromise ??= medusaFetch<StoreContext>("/store/custom");
  return storeContextPromise;
}

async function getRegionId() {
  const storeContext = await getStoreContext();
  const regionId = storeContext.region?.id;

  if (!regionId) {
    throw new Error("Missing store region");
  }

  return regionId;
}

async function getSalesChannelId() {
  const storeContext = await getStoreContext();
  const salesChannelId = storeContext.store?.default_sales_channel_id;

  if (!salesChannelId) {
    throw new Error("Missing default sales channel");
  }

  return salesChannelId;
}

export function formatPrice(amount: number, currencyCode = "eur") {
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100);
}

export function getProductImageSrc(product: Pick<StoreProduct, "handle" | "thumbnail">) {
  return PRODUCT_IMAGE_BY_HANDLE[product.handle] ?? product.thumbnail ?? null;
}

export function getCartItemImageSrc(
  item: Pick<StoreCart["items"][number], "product_handle" | "thumbnail">
) {
  return PRODUCT_IMAGE_BY_HANDLE[item.product_handle] ?? item.thumbnail ?? null;
}

export function getProductInfo(handle: string): ProductInfo {
  return (
    PRODUCT_INFO_BY_HANDLE[handle as keyof typeof PRODUCT_INFO_BY_HANDLE] ?? {
      badge: "LIMI",
      catalogNumber: handle.toUpperCase(),
      category: "LIMI kolekcia",
      description:
        "Jemné tvorenie plné detailov, malých objavov a radosti z každého nalepeného kúsku.",
      highlights: [
        "podporuje kreativitu a jemnú motoriku",
        "vhodné na spoločné tvorivé chvíle",
        "hravý dizajn pre detskú fantáziu",
      ],
      includes: ["produkt z kolekcie LIMI"],
      stockLabel: "Dostupné online",
    }
  );
}

export function getProductCollectionImages(handle: string): readonly ProductCollectionImage[] {
  return (
    PRODUCT_COLLECTION_IMAGES_BY_HANDLE[
      handle as keyof typeof PRODUCT_COLLECTION_IMAGES_BY_HANDLE
    ] ?? []
  );
}

export async function listProducts() {
  const regionId = await getRegionId();
  const salesChannelId = await getSalesChannelId();
  const data = await medusaFetch<{ products: StoreProduct[] }>(
    `/store/products?limit=20&region_id=${regionId}&sales_channel_id=${salesChannelId}&fields=*variants.calculated_price,+variants.inventory_quantity`
  );

  return data.products;
}

export async function getProductByHandle(handle: string) {
  const regionId = await getRegionId();
  const salesChannelId = await getSalesChannelId();
  const data = await medusaFetch<{ products: StoreProduct[] }>(
    `/store/products?handle[0]=${encodeURIComponent(handle)}&region_id=${regionId}&sales_channel_id=${salesChannelId}&fields=*variants.calculated_price,+variants.inventory_quantity`
  );

  return data.products[0] ?? null;
}

export async function createCart() {
  const storeContext = await getStoreContext();
  const salesChannelId = storeContext.store?.default_sales_channel_id;
  const regionId = storeContext.region?.id;

  if (!salesChannelId) {
    throw new Error("Missing default sales channel for cart creation");
  }

  if (!regionId) {
    throw new Error("Missing store region for cart creation");
  }

  const data = await medusaFetch<{ cart: StoreCart }>("/store/carts", {
    method: "POST",
    body: JSON.stringify({
      region_id: regionId,
      sales_channel_id: salesChannelId,
    }),
  });

  return data.cart;
}

export async function getCart(cartId: string) {
  const data = await medusaFetch<{ cart: StoreCart }>(`/store/carts/${cartId}`);
  return data.cart;
}

export async function updateCart(
  cartId: string,
  input: {
    email: string;
    shipping_address: AddressInput;
    billing_address: AddressInput;
  }
) {
  const data = await medusaFetch<{ cart: StoreCart }>(`/store/carts/${cartId}`, {
    method: "POST",
    body: JSON.stringify(input),
  });

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

export async function updateLineItem(cartId: string, lineItemId: string, quantity: number) {
  const data = await medusaFetch<{ cart: StoreCart }>(
    `/store/carts/${cartId}/line-items/${lineItemId}`,
    {
      method: "POST",
      body: JSON.stringify({
        quantity,
      }),
    }
  );

  return data.cart;
}

export async function removeLineItem(cartId: string, lineItemId: string) {
  const data = await medusaFetch<{ cart: StoreCart }>(
    `/store/carts/${cartId}/line-items/${lineItemId}`,
    {
      method: "POST",
      body: JSON.stringify({
        quantity: 0,
      }),
    }
  );

  return data.cart;
}

export async function listShippingOptions(cartId: string) {
  const data = await medusaFetch<{ shipping_options: StoreShippingOption[] }>(
    `/store/shipping-options?cart_id=${encodeURIComponent(cartId)}`
  );

  return data.shipping_options;
}

export async function addShippingMethod(cartId: string, optionId: string) {
  const data = await medusaFetch<{ cart: StoreCart }>(`/store/carts/${cartId}/shipping-methods`, {
    method: "POST",
    body: JSON.stringify({
      option_id: optionId,
    }),
  });

  return data.cart;
}

export async function listPaymentProviders() {
  const regionId = await getRegionId();
  const data = await medusaFetch<{ payment_providers: StorePaymentProvider[] }>(
    `/store/payment-providers?region_id=${regionId}`
  );

  return data.payment_providers;
}

export async function createPaymentCollection(cartId: string) {
  const data = await medusaFetch<{ payment_collection: StorePaymentCollection }>(
    "/store/payment-collections",
    {
      method: "POST",
      body: JSON.stringify({
        cart_id: cartId,
      }),
    }
  );

  return data.payment_collection;
}

export async function createPaymentSession(paymentCollectionId: string, providerId: string) {
  const data = await medusaFetch<{ payment_collection: StorePaymentCollection }>(
    `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
    {
      method: "POST",
      body: JSON.stringify({
        provider_id: providerId,
      }),
    }
  );

  return data.payment_collection;
}

export async function completeCart(cartId: string) {
  const data = await medusaFetch<{ type: "order"; order: StoreOrder }>(
    `/store/carts/${cartId}/complete`,
    {
      method: "POST",
    }
  );

  return data.order;
}

export async function sendCheckoutNotification(input: {
  order_display_id: number;
  email: string;
  customer_name: string;
  total: number;
  currency_code: string;
  items: Array<{ title: string; quantity: number }>;
}) {
  return medusaFetch<CheckoutNotificationResponse>("/store/checkout-notify", {
    method: "POST",
    body: JSON.stringify(input),
  });
}


