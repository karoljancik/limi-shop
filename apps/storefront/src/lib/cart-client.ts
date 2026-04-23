"use client";

import {
  addLineItem,
  createCart,
  getCart,
  removeLineItem,
  type StoreCart,
  updateLineItem,
} from "./medusa";

const CART_COOKIE_KEY = "limi-cart-id";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setCookie(name: string, value: string, days = 30) {
  if (typeof document === "undefined") {
    return;
  }
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export function getStoredCartId() {
  if (typeof window === "undefined") {
    return null;
  }

  // Migration from localStorage if cookie doesn't exist
  const fromCookie = getCookie(CART_COOKIE_KEY);
  if (fromCookie) {
    return fromCookie;
  }

  const fromLocal = window.localStorage.getItem("limi-cart-id");
  if (fromLocal) {
    setCookie(CART_COOKIE_KEY, fromLocal);
    window.localStorage.removeItem("limi-cart-id");
    return fromLocal;
  }

  return null;
}

function setStoredCartId(cartId: string) {
  setCookie(CART_COOKIE_KEY, cartId);
}

function clearStoredCartId() {
  deleteCookie(CART_COOKIE_KEY);
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
