"use client";

import {
  addLineItem,
  createCart,
  getCart,
  removeLineItem,
  type StoreCart,
  updateLineItem,
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

function clearStoredCartId() {
  window.localStorage.removeItem(CART_STORAGE_KEY);
}

export function resetStoredCart() {
  clearStoredCartId();
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

export async function addVariantToCart(variantId: string, quantity = 1) {
  const cartId = await ensureCart();
  return addLineItem(cartId, variantId, quantity);
}

export async function updateCartItemQuantity(lineItemId: string, quantity: number) {
  const cartId = getStoredCartId();

  if (!cartId) {
    return null;
  }

  if (quantity <= 0) {
    return removeCartItem(lineItemId);
  }

  return updateLineItem(cartId, lineItemId, quantity);
}

export async function removeCartItem(lineItemId: string) {
  const cartId = getStoredCartId();

  if (!cartId) {
    return null;
  }

  return removeLineItem(cartId, lineItemId);
}

export async function clearCart() {
  const cart = await loadCurrentCart();

  if (!cart) {
    clearStoredCartId();
    return null;
  }

  let nextCart = cart;

  for (const item of cart.items) {
    nextCart = await removeLineItem(cart.id, item.id);
  }

  return nextCart;
}

export async function loadCurrentCart(): Promise<StoreCart | null> {
  const cartId = getStoredCartId();

  if (!cartId) {
    return null;
  }

  try {
    return await getCart(cartId);
  } catch {
    clearStoredCartId();
    return null;
  }
}
