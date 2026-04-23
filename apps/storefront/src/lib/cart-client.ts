"use client";

import {
  addLineItem,
  createCart,
  getCart,
  type StoreCart,
} from "./medusa";

const CART_STORAGE_KEY = "limi-cart-id";

export function getStoredCartId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(CART_STORAGE_KEY);
}

function setStoredCartId(cartId: string) {
  window.localStorage.setItem(CART_STORAGE_KEY, cartId);
}

export async function ensureCart() {
  const existing = getStoredCartId();

  if (existing) {
    return existing;
  }

  const cart = await createCart();
  setStoredCartId(cart.id);
  return cart.id;
}

export async function addVariantToCart(variantId: string) {
  const cartId = await ensureCart();
  return addLineItem(cartId, variantId, 1);
}

export async function loadCurrentCart(): Promise<StoreCart | null> {
  const cartId = getStoredCartId();

  if (!cartId) {
    return null;
  }

  try {
    return await getCart(cartId);
  } catch {
    return null;
  }
}
