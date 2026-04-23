"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useCart } from "@/components/cart-provider";
import {
  clearCart,
  loadCurrentCart,
  removeCartItem,
  resetStoredCart,
  updateCartItemQuantity,
} from "@/lib/cart-client";
import {
  addShippingMethod,
  completeCart,
  createPaymentCollection,
  createPaymentSession,
  formatPrice,
  getCartItemImageSrc,
  listPaymentProviders,
  listShippingOptions,
  sendCheckoutNotification,
  type AddressInput,
  type CheckoutNotificationResponse,
  type StoreCart,
  type StoreOrder,
  type StorePaymentProvider,
  type StoreShippingOption,
  updateCart,
} from "@/lib/medusa";

type CheckoutFormState = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address_1: string;
  city: string;
  postal_code: string;
  country_code: string;
};

const INITIAL_FORM: CheckoutFormState = {
  email: "",
  first_name: "",
  last_name: "",
  phone: "",
  address_1: "",
  city: "",
  postal_code: "",
  country_code: "sk",
};

function buildAddress(form: CheckoutFormState): AddressInput {
  return {
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    address_1: form.address_1.trim(),
    city: form.city.trim(),
    postal_code: form.postal_code.trim(),
    country_code: form.country_code,
    phone: form.phone.trim(),
  };
}

function validateForm(form: CheckoutFormState) {
  if (
    !form.email.trim() ||
    !form.first_name.trim() ||
    !form.last_name.trim() ||
    !form.phone.trim() ||
    !form.address_1.trim() ||
    !form.city.trim() ||
    !form.postal_code.trim()
  ) {
    return "Vyplň prosím kontaktné údaje aj adresu pre doručenie.";
  }

  return null;
}

export function CartSummary() {
  const { refreshCart } = useCart();
  const [cart, setCart] = useState<StoreCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [draftQuantities, setDraftQuantities] = useState<Record<string, number>>({});
  const [shippingOptions, setShippingOptions] = useState<StoreShippingOption[]>([]);
  const [paymentProviders, setPaymentProviders] = useState<StorePaymentProvider[]>([]);
  const [selectedShippingOptionId, setSelectedShippingOptionId] = useState<string>("");
  const [selectedPaymentProviderId, setSelectedPaymentProviderId] =
    useState<string>("pp_system_default");
  const [form, setForm] = useState<CheckoutFormState>(INITIAL_FORM);
  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [notification, setNotification] = useState<CheckoutNotificationResponse | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function syncDrafts(nextCart: StoreCart | null) {
    setCart(nextCart);
    setDraftQuantities(
      Object.fromEntries((nextCart?.items ?? []).map((item) => [item.id, item.quantity]))
    );
  }

  useEffect(() => {
    let mounted = true;

    async function hydrateCheckout() {
      const nextCart = await loadCurrentCart();

      if (!mounted) {
        return;
      }

      syncDrafts(nextCart);

      if (nextCart?.items.length) {
        const [nextShippingOptions, nextPaymentProviders] = await Promise.all([
          listShippingOptions(nextCart.id),
          listPaymentProviders(),
        ]);

        if (!mounted) {
          return;
        }

        setShippingOptions(nextShippingOptions);
        setPaymentProviders(nextPaymentProviders);
        setSelectedShippingOptionId(
          nextShippingOptions[0]?.id ?? nextCart.shipping_methods?.[0]?.shipping_option_id ?? ""
        );
        setSelectedPaymentProviderId(nextPaymentProviders[0]?.id ?? "pp_system_default");
      }

      setLoading(false);
    }

    hydrateCheckout().catch(() => {
      if (mounted) {
        setLoading(false);
        setCheckoutError("Nepodarilo sa načítať checkout. Skús obnoviť stránku.");
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  function runCartAction(action: () => Promise<StoreCart | null>, successMessage?: string) {
    startTransition(async () => {
      try {
        const nextCart = await action();
        syncDrafts(nextCart);
        await refreshCart();
        setFeedback(successMessage ?? null);
      } catch {
        setFeedback("Niečo sa nepodarilo upraviť v košíku. Skús to ešte raz.");
      } finally {
        setActiveItemId(null);
      }
    });
  }

  function updateFormField<K extends keyof CheckoutFormState>(key: K, value: CheckoutFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  if (loading) {
    return <p className="text-sm text-[var(--muted)]">Načítavam košík a checkout...</p>;
  }

  if (order && notification) {
    return (
      <div className="space-y-6">
        <div className="card space-y-4 p-6">
          <p className="eyebrow">Objednávka prijatá</p>
          <h2 className="text-3xl font-black">Ďakujeme, objednávka je vytvorená.</h2>
          <p className="text-[var(--muted)]">
            Číslo objednávky <strong>#{order.display_id}</strong>. Platbu zatiaľ uhraď bankovým
            prevodom, a po prijatí platby budeme objednávku spracovávať.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Platobné údaje
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <p>
                  <strong>Príjemca:</strong> {notification.bank_transfer.account_name}
                </p>
                <p>
                  <strong>Banka:</strong> {notification.bank_transfer.bank_name}
                </p>
                <p>
                  <strong>IBAN:</strong> {notification.bank_transfer.iban}
                </p>
                <p>
                  <strong>SWIFT:</strong> {notification.bank_transfer.swift}
                </p>
                <p>
                  <strong>Variabilný symbol:</strong>{" "}
                  {notification.bank_transfer.payment_reference}
                </p>
                <p>
                  <strong>Suma:</strong> {formatPrice(order.total, order.currency_code)}
                </p>
              </div>
            </div>
            <div className="card p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                E-mail a ďalší krok
              </p>
              <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                <p>{notification.message}</p>
                <p>
                  Objednávka je vedená na e-mail <strong>{order.email}</strong>.
                </p>
                <p>
                  Po prijatí platby môžeme objednávku označiť ako zaplatenú a pripraviť na
                  odoslanie.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary">
              Pokračovať v nakupovaní
            </Link>
            <Link href="/" className="btn-secondary">
              Späť na domov
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="card space-y-4 p-6" data-testid="empty-cart">
        <p className="text-sm text-[var(--muted)]">Košík je zatiaľ prázdny.</p>
        <Link href="/shop" className="btn-primary w-fit">
          Vybrať nálepky
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="cart-summary">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">
          V košíku máš {cart.items.length} {cart.items.length === 1 ? "položku" : "položky"}.
        </p>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setFeedback(null);
            runCartAction(() => clearCart(), "Košík bol vyprázdnený.");
          }}
          disabled={isPending}
        >
          Vymazať obsah košíka
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {cart.items.map((item) => {
            const draftQuantity = draftQuantities[item.id] ?? item.quantity;
            const isItemPending = isPending && activeItemId === item.id;

            return (
              <div
                key={item.id}
                className="card flex flex-col gap-4 p-4 md:flex-row md:items-center"
                data-testid="cart-item"
              >
                {getCartItemImageSrc(item) ? (
                  <Image
                    src={getCartItemImageSrc(item)!}
                    alt={item.product_title}
                    width={84}
                    height={84}
                    unoptimized
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                ) : null}

                <div className="flex-1">
                  <Link href={`/shop/${item.product_handle}`} className="font-semibold">
                    {item.product_title}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {formatPrice(item.unit_price)} za kus
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center overflow-hidden rounded-full border border-[var(--line)] bg-white/90">
                    <button
                      type="button"
                      className="h-10 w-10 text-lg font-semibold transition hover:bg-[rgba(241,196,206,0.24)] disabled:opacity-50"
                      aria-label={`Znížiť množstvo pre ${item.product_title}`}
                      onClick={() => {
                        const nextQuantity = Math.max(1, draftQuantity - 1);
                        setActiveItemId(item.id);
                        setFeedback(null);
                        setDraftQuantities((current) => ({ ...current, [item.id]: nextQuantity }));
                        runCartAction(
                          () => updateCartItemQuantity(item.id, nextQuantity),
                          "Množstvo v košíku bolo upravené."
                        );
                      }}
                      disabled={isItemPending}
                    >
                      -
                    </button>

                    <input
                      type="number"
                      min={1}
                      max={99}
                      inputMode="numeric"
                      className="h-10 w-16 border-x border-[var(--line)] bg-transparent px-2 text-center font-semibold outline-none"
                      value={draftQuantity}
                      onChange={(event) => {
                        const nextValue = Number.parseInt(event.target.value, 10);
                        setDraftQuantities((current) => ({
                          ...current,
                          [item.id]: Number.isNaN(nextValue)
                            ? 1
                            : Math.min(99, Math.max(1, nextValue)),
                        }));
                      }}
                      onBlur={() => {
                        const nextQuantity = Math.min(99, Math.max(1, draftQuantity));

                        if (nextQuantity === item.quantity) {
                          return;
                        }

                        setActiveItemId(item.id);
                        setFeedback(null);
                        runCartAction(
                          () => updateCartItemQuantity(item.id, nextQuantity),
                          "Množstvo v košíku bolo upravené."
                        );
                      }}
                    />

                    <button
                      type="button"
                      className="h-10 w-10 text-lg font-semibold transition hover:bg-[rgba(241,196,206,0.24)] disabled:opacity-50"
                      aria-label={`Zvýšiť množstvo pre ${item.product_title}`}
                      onClick={() => {
                        const nextQuantity = Math.min(99, draftQuantity + 1);
                        setActiveItemId(item.id);
                        setFeedback(null);
                        setDraftQuantities((current) => ({ ...current, [item.id]: nextQuantity }));
                        runCartAction(
                          () => updateCartItemQuantity(item.id, nextQuantity),
                          "Množstvo v košíku bolo upravené."
                        );
                      }}
                      disabled={isItemPending}
                    >
                      +
                    </button>
                  </div>

                  <div className="min-w-28 text-right">
                    <p className="font-semibold">{formatPrice(item.unit_price * item.quantity)}</p>
                    <button
                      type="button"
                      className="mt-1 text-sm font-medium text-[var(--accent-strong)] transition hover:opacity-80 disabled:opacity-50"
                      onClick={() => {
                        setActiveItemId(item.id);
                        setFeedback(null);
                        runCartAction(
                          () => removeCartItem(item.id),
                          "Položka bola odstránená z košíka."
                        );
                      }}
                      disabled={isItemPending}
                    >
                      Odstrániť
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="card space-y-5 p-6">
            <div>
              <p className="eyebrow">Kontakt a doručenie</p>
              <h3 className="mt-2 text-2xl font-black">Dokončiť objednávku</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">
                <span>E-mail</span>
                <input
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateFormField("email", event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>Telefón</span>
                <input
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateFormField("phone", event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>Meno</span>
                <input
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  value={form.first_name}
                  onChange={(event) => updateFormField("first_name", event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>Priezvisko</span>
                <input
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  value={form.last_name}
                  onChange={(event) => updateFormField("last_name", event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm font-medium md:col-span-2">
                <span>Ulica a číslo</span>
                <input
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  value={form.address_1}
                  onChange={(event) => updateFormField("address_1", event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>Mesto</span>
                <input
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  value={form.city}
                  onChange={(event) => updateFormField("city", event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>PSČ</span>
                <input
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  value={form.postal_code}
                  onChange={(event) => updateFormField("postal_code", event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>Krajina</span>
                <select
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  value={form.country_code}
                  onChange={(event) => updateFormField("country_code", event.target.value)}
                >
                  <option value="sk">Slovensko</option>
                  <option value="cz">Česko</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Doprava
                </p>
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--line)] bg-white/85 p-4"
                  >
                    <input
                      type="radio"
                      name="shipping_option"
                      className="mt-1"
                      checked={selectedShippingOptionId === option.id}
                      onChange={() => setSelectedShippingOptionId(option.id)}
                    />
                    <span className="flex-1">
                      <span className="block font-semibold">{option.name}</span>
                      <span className="mt-1 block text-sm text-[var(--muted)]">
                        {option.type?.description ?? "Štandardné doručenie na adresu."}
                      </span>
                    </span>
                    <span className="font-semibold">
                      {formatPrice(option.amount, cart.currency_code)}
                    </span>
                  </label>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Platba
                </p>
                {paymentProviders.map((provider) => (
                  <label
                    key={provider.id}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--line)] bg-white/85 p-4"
                  >
                    <input
                      type="radio"
                      name="payment_provider"
                      className="mt-1"
                      checked={selectedPaymentProviderId === provider.id}
                      onChange={() => setSelectedPaymentProviderId(provider.id)}
                    />
                    <span>
                      <span className="block font-semibold">Bankový prevod</span>
                      <span className="mt-1 block text-sm text-[var(--muted)]">
                        Objednávku odošleš bez online platby. Platobné údaje dostaneš po
                        potvrdení objednávky.
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {checkoutError ? <p className="text-sm text-red-600">{checkoutError}</p> : null}
            {feedback ? <p className="text-sm text-[var(--muted)]">{feedback}</p> : null}

            <button
              type="button"
              className="btn-primary w-full"
              onClick={() => {
                startTransition(async () => {
                  try {
                    setCheckoutError(null);
                    setFeedback(null);

                    const validationError = validateForm(form);

                    if (validationError) {
                      setCheckoutError(validationError);
                      return;
                    }

                    if (!selectedShippingOptionId) {
                      setCheckoutError("Vyber spôsob doručenia.");
                      return;
                    }

                    if (!selectedPaymentProviderId) {
                      setCheckoutError("Vyber spôsob platby.");
                      return;
                    }

                    const address = buildAddress(form);
                    let nextCart = await updateCart(cart.id, {
                      email: form.email.trim(),
                      shipping_address: address,
                      billing_address: address,
                    });

                    const hasSelectedShipping = nextCart.shipping_methods?.some(
                      (method) => method.shipping_option_id === selectedShippingOptionId
                    );

                    if (!hasSelectedShipping) {
                      nextCart = await addShippingMethod(nextCart.id, selectedShippingOptionId);
                    }

                    const paymentCollection = await createPaymentCollection(nextCart.id);
                    await createPaymentSession(paymentCollection.id, selectedPaymentProviderId);

                    const createdOrder = await completeCart(nextCart.id);

                    let nextNotification: CheckoutNotificationResponse;

                    try {
                      nextNotification = await sendCheckoutNotification({
                        order_display_id: createdOrder.display_id,
                        email: createdOrder.email,
                        customer_name: `${form.first_name} ${form.last_name}`.trim(),
                        total: createdOrder.total,
                        currency_code: createdOrder.currency_code,
                        items: cart.items.map((item) => ({
                          title: item.product_title,
                          quantity: item.quantity,
                        })),
                      });
                    } catch {
                      nextNotification = {
                        bank_transfer: {
                          account_name: "Limi",
                          bank_name: "Doplň banku v env",
                          iban: "Doplň IBAN v env",
                          swift: "Doplň SWIFT v env",
                          payment_reference: String(createdOrder.display_id),
                        },
                        email_sent: false,
                        message:
                          "Objednávka je vytvorená, ale e-mail s platobnými údajmi sa nepodarilo odoslať.",
                      };
                    }

                    resetStoredCart();
                    syncDrafts(null);
                    await refreshCart();
                    setNotification(nextNotification);
                    setOrder(createdOrder);
                  } catch (error) {
                    const message =
                      error instanceof Error
                        ? error.message
                        : "Objednávku sa nepodarilo dokončiť. Skús to ešte raz.";
                    setCheckoutError(message);
                  }
                });
              }}
              disabled={isPending}
            >
              {isPending ? "Dokončujem objednávku..." : "Objednať s bankovým prevodom"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card space-y-4 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Rekapitulácia
            </p>
            <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <span>Medzisúčet</span>
              <span>{formatPrice(cart.subtotal, cart.currency_code)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <span>Doprava</span>
              <span>
                {selectedShippingOptionId
                  ? formatPrice(
                      shippingOptions.find((option) => option.id === selectedShippingOptionId)
                        ?.amount ?? 0,
                      cart.currency_code
                    )
                  : "Vyber dopravu"}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--line)] pt-4 text-lg font-bold">
              <span>Predpokladaná suma spolu</span>
              <span>
                {formatPrice(
                  cart.subtotal +
                    (shippingOptions.find((option) => option.id === selectedShippingOptionId)
                      ?.amount ?? 0),
                  cart.currency_code
                )}
              </span>
            </div>
          </div>

          <div className="card space-y-4 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Ako to bude fungovať
            </p>
            <ol className="space-y-3 text-sm text-[var(--muted)]">
              <li>1. Vyplníš kontaktné údaje a adresu.</li>
              <li>2. Potvrdíš objednávku cez bankový prevod.</li>
              <li>3. Zobrazíme ti platobné údaje a pokúsime sa ich poslať aj mailom.</li>
              <li>4. Po prijatí platby objednávku spracujeme.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
