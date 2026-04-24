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
  getProductTranslation,
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

export function CartSummary({ locale = "sk" }: { locale?: string }) {
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

  const isEn = locale === "en";

  const t = {
    loading: isEn ? "Loading cart and checkout..." : "Načítavam košík a checkout...",
    empty: isEn ? "Cart is empty." : "Košík je zatiaľ prázdny.",
    chooseStickers: isEn ? "Choose Stickers" : "Vybrať nálepky",
    itemsCount: (count: number) => 
      isEn 
        ? `You have ${count} ${count === 1 ? "item" : "items"} in your cart.` 
        : `V košíku máš ${count} ${count === 1 ? "položku" : "položky"}.`,
    clearCart: isEn ? "Clear cart" : "Vymazať obsah košíka",
    cleared: isEn ? "Cart was cleared." : "Košík bol vyprázdnený.",
    remove: isEn ? "Remove" : "Odstrániť",
    removed: isEn ? "Item was removed from the cart." : "Položka bola odstránená z košíka.",
    pricePerUnit: isEn ? "per unit" : "za kus",
    quantityUpdated: isEn ? "Quantity was updated." : "Množstvo v košíku bolo upravené.",
    contactTitle: isEn ? "Contact and Delivery" : "Kontakt a doručenie",
    checkoutTitle: isEn ? "Complete Order" : "Dokončiť objednávku",
    email: isEn ? "E-mail" : "E-mail",
    phone: isEn ? "Phone" : "Telefón",
    firstName: isEn ? "First Name" : "Meno",
    lastName: isEn ? "Last Name" : "Priezvisko",
    address: isEn ? "Street and Number" : "Ulica a číslo",
    city: isEn ? "City" : "Mesto",
    postalCode: isEn ? "Postal Code" : "PSČ",
    country: isEn ? "Country" : "Krajina",
    slovakia: isEn ? "Slovakia" : "Slovensko",
    czechia: isEn ? "Czechia" : "Česko",
    shipping: isEn ? "Shipping" : "Doprava",
    payment: isEn ? "Payment" : "Platba",
    bankTransfer: isEn ? "Bank Transfer" : "Bankový prevod",
    bankTransferDesc: isEn 
      ? "Send order without online payment. You will receive payment details after confirmation."
      : "Objednávku odošleš bez online platby. Platobné údaje dostaneš po potvrdení objednávky.",
    summary: isEn ? "Summary" : "Rekapitulácia",
    subtotal: isEn ? "Subtotal" : "Medzisúčet",
    total: isEn ? "Estimated total" : "Predpokladaná suma spolu",
    howItWorks: isEn ? "How it works" : "Ako to bude fungovať",
    steps: isEn ? [
      "1. Fill in contact info and address.",
      "2. Confirm order via bank transfer.",
      "3. We show you payment details and send them via email.",
      "4. After receiving payment we process the order."
    ] : [
      "1. Vyplníš kontaktné údaje a adresu.",
      "2. Potvrdíš objednávku cez bankovým prevod.",
      "3. Zobrazíme ti platobné údaje a pokúsime sa ich poslať aj mailom.",
      "4. Po prijatí platby objednávku spracujeme."
    ],
    orderSuccess: isEn ? "Order received" : "Objednávka prijatá",
    orderSuccessDesc: isEn ? "Thank you, your order has been created." : "Ďakujeme, objednávka je vytvorená.",
    orderNumberLabel: isEn ? "Order number" : "Číslo objednávky",
    paymentInstructions: isEn 
      ? "Pay via bank transfer. We will process your order after receiving payment."
      : "Platbu zatiaľ uhraď bankovým prevodom, a po prijatí platbe budeme objednávku spracovávať.",
    paymentDetailsLabel: isEn ? "Payment Details" : "Platobné údaje",
    recipient: isEn ? "Recipient" : "Príjemca",
    bank: isEn ? "Bank" : "Banka",
    iban: "IBAN",
    swift: "SWIFT",
    varSymbol: isEn ? "Variable Symbol" : "Variabilný symbol",
    amount: isEn ? "Amount" : "Suma",
    emailNextStep: isEn ? "Email and Next Step" : "E-mail a ďalší krok",
    orderEmailAt: (email: string) => isEn ? `Order is sent to email ${email}.` : `Objednávka je vedená na e-mail ${email}.`,
    processedAfterPayment: isEn 
      ? "After receiving payment we can mark the order as paid and prepare for shipping."
      : "Po prijatí platby môžeme objednávku označiť ako zaplatenú a pripraviť na odoslanie.",
    continueShopping: isEn ? "Continue Shopping" : "Pokračovať v nakupovaní",
    backHome: isEn ? "Back to Home" : "Späť na domov",
    placeOrder: isEn ? "Order with bank transfer" : "Objednať s bankovým prevodom",
    placingOrder: isEn ? "Ordering..." : "Dokončujem objednávku...",
    validationError: isEn ? "Please fill in contact details and delivery address." : "Vyplň prosím kontaktné údaje aj adresu pre doručenie.",
    shippingError: isEn ? "Select shipping method." : "Vyber spôsob doručenia.",
    paymentError: isEn ? "Select payment method." : "Vyber spôsob platby.",
    genericError: isEn ? "Something went wrong. Please try again." : "Niečo sa nepodarilo. Skús to ešte raz.",
  };

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
      return t.validationError;
    }
    return null;
  }

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
        setCheckoutError(isEn ? "Failed to load checkout. Try refreshing." : "Nepodarilo sa načítať checkout. Skús obnoviť stránku.");
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
        setFeedback(t.genericError);
      } finally {
        setActiveItemId(null);
      }
    });
  }

  function updateFormField<K extends keyof CheckoutFormState>(key: K, value: CheckoutFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  if (loading) {
    return <p className="text-sm text-[var(--muted)]">{t.loading}</p>;
  }

  if (order && notification) {
    return (
      <div className="space-y-6">
        <div className="card space-y-4 p-6">
          <p className="eyebrow">{t.orderSuccess}</p>
          <h2 className="text-3xl font-black">{t.orderSuccessDesc}</h2>
          <p className="text-[var(--muted)]">
            {t.orderNumberLabel} <strong>#{order.display_id}</strong>. {t.paymentInstructions}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                {t.paymentDetailsLabel}
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <p>
                  <strong>{t.recipient}:</strong> {notification.bank_transfer.account_name}
                </p>
                <p>
                  <strong>{t.bank}:</strong> {notification.bank_transfer.bank_name}
                </p>
                <p>
                  <strong>{t.iban}:</strong> {notification.bank_transfer.iban}
                </p>
                <p>
                  <strong>{t.swift}:</strong> {notification.bank_transfer.swift}
                </p>
                <p>
                  <strong>{t.varSymbol}:</strong>{" "}
                  {notification.bank_transfer.payment_reference}
                </p>
                <p>
                  <strong>{t.amount}:</strong> {formatPrice(order.total, order.currency_code, locale)}
                </p>
              </div>
            </div>
            <div className="card p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                {t.emailNextStep}
              </p>
              <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                <p>{notification.message}</p>
                <p>
                  {t.orderEmailAt(order.email)}
                </p>
                <p>
                  {t.processedAfterPayment}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/shop`} className="btn-primary">
              {t.continueShopping}
            </Link>
            <Link href={`/${locale}`} className="btn-secondary">
              {t.backHome}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="card space-y-4 p-6" data-testid="empty-cart">
        <p className="text-sm text-[var(--muted)]">{t.empty}</p>
        <Link href={`/${locale}/shop`} className="btn-primary w-fit">
          {t.chooseStickers}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="cart-summary">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">
          {t.itemsCount(cart.items.length)}
        </p>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setFeedback(null);
            runCartAction(() => clearCart(), t.cleared);
          }}
          disabled={isPending}
        >
          {t.clearCart}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {cart.items.map((item) => {
            const draftQuantity = draftQuantities[item.id] ?? item.quantity;
            const isItemPending = isPending && activeItemId === item.id;
            const itemTranslation = getProductTranslation(item.product_handle, locale);
            const itemTitle = itemTranslation?.title ?? item.product_title;

            return (
              <div
                key={item.id}
                className="card flex flex-col gap-4 p-4 md:flex-row md:items-center"
                data-testid="cart-item"
              >
                {getCartItemImageSrc(item) ? (
                  <Image
                    src={getCartItemImageSrc(item)!}
                    alt={itemTitle}
                    width={84}
                    height={84}
                    unoptimized
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                ) : null}

                <div className="flex-1">
                  <Link href={`/${locale}/shop/${item.product_handle}`} className="font-semibold">
                    {itemTitle}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {formatPrice(item.unit_price, cart.currency_code, locale)} {t.pricePerUnit}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center overflow-hidden rounded-full border border-[var(--line)] bg-white/90">
                    <button
                      type="button"
                      className="h-10 w-10 text-lg font-semibold transition hover:bg-[rgba(241,196,206,0.24)] disabled:opacity-50"
                      aria-label={`${isEn ? "Decrease quantity for" : "Znížiť množstvo pre"} ${itemTitle}`}
                      onClick={() => {
                        const nextQuantity = Math.max(1, draftQuantity - 1);
                        setActiveItemId(item.id);
                        setFeedback(null);
                        setDraftQuantities((current) => ({ ...current, [item.id]: nextQuantity }));
                        runCartAction(
                          () => updateCartItemQuantity(item.id, nextQuantity),
                          t.quantityUpdated
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
                          t.quantityUpdated
                        );
                      }}
                    />

                    <button
                      type="button"
                      className="h-10 w-10 text-lg font-semibold transition hover:bg-[rgba(241,196,206,0.24)] disabled:opacity-50"
                      aria-label={`${isEn ? "Increase quantity for" : "Zvýšiť množstvo pre"} ${itemTitle}`}
                      onClick={() => {
                        const nextQuantity = Math.min(99, draftQuantity + 1);
                        setActiveItemId(item.id);
                        setFeedback(null);
                        setDraftQuantities((current) => ({ ...current, [item.id]: nextQuantity }));
                        runCartAction(
                          () => updateCartItemQuantity(item.id, nextQuantity),
                          t.quantityUpdated
                        );
                      }}
                      disabled={isItemPending}
                    >
                      +
                    </button>
                  </div>

                  <div className="min-w-28 text-right">
                    <p className="font-semibold">{formatPrice(item.unit_price * item.quantity, cart.currency_code, locale)}</p>
                    <button
                      type="button"
                      className="mt-1 text-sm font-medium text-[var(--accent-strong)] transition hover:opacity-80 disabled:opacity-50"
                      onClick={() => {
                        setActiveItemId(item.id);
                        setFeedback(null);
                        runCartAction(
                          () => removeCartItem(item.id),
                          t.removed
                        );
                      }}
                      disabled={isItemPending}
                    >
                      {t.remove}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <form className="card space-y-5 p-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <p className="eyebrow">{t.contactTitle}</p>
              <h3 className="mt-2 text-2xl font-black">{t.checkoutTitle}</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">
                <span>{t.email}</span>
                <input
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => updateFormField("email", event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>{t.phone}</span>
                <input
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) => updateFormField("phone", event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>{t.firstName}</span>
                <input
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  name="first_name"
                  autoComplete="given-name"
                  value={form.first_name}
                  onChange={(event) => updateFormField("first_name", event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>{t.lastName}</span>
                <input
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  name="last_name"
                  autoComplete="family-name"
                  value={form.last_name}
                  onChange={(event) => updateFormField("last_name", event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm font-medium md:col-span-2">
                <span>{t.address}</span>
                <input
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  name="address"
                  autoComplete="address-line1"
                  value={form.address_1}
                  onChange={(event) => updateFormField("address_1", event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>{t.city}</span>
                <input
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  name="city"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(event) => updateFormField("city", event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>{t.postalCode}</span>
                <input
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  name="postal_code"
                  autoComplete="postal-code"
                  value={form.postal_code}
                  onChange={(event) => updateFormField("postal_code", event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>{t.country}</span>
                <select
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none"
                  name="country"
                  autoComplete="country"
                  value={form.country_code}
                  onChange={(event) => updateFormField("country_code", event.target.value)}
                >
                  <option value="sk">{t.slovakia}</option>
                  <option value="cz">{t.czechia}</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {t.shipping}
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
                        {option.type?.description ?? (isEn ? "Standard delivery to address." : "Štandardné doručenie na adresu.")}
                      </span>
                    </span>
                    <span className="font-semibold">
                      {formatPrice(option.amount, cart.currency_code, locale)}
                    </span>
                  </label>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {t.payment}
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
                      <span className="block font-semibold">{t.bankTransfer}</span>
                      <span className="mt-1 block text-sm text-[var(--muted)]">
                        {t.bankTransferDesc}
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
                      setCheckoutError(t.shippingError);
                      return;
                    }

                    if (!selectedPaymentProviderId) {
                      setCheckoutError(t.paymentError);
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
                          bank_name: isEn ? "Fill in bank in env" : "Doplň banku v env",
                          iban: isEn ? "Fill in IBAN in env" : "Doplň IBAN v env",
                          swift: isEn ? "Fill in SWIFT in env" : "Doplň SWIFT v env",
                          payment_reference: String(createdOrder.display_id),
                        },
                        email_sent: false,
                        message: isEn 
                          ? "Order is created, but the email with payment details failed to send."
                          : "Objednávka je vytvorená, ale e-mail s platobnými údajmi sa nepodarilo odoslať.",
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
                        : t.genericError;
                    setCheckoutError(message);
                  }
                });
              }}
              disabled={isPending}
            >
              {isPending ? t.placingOrder : t.placeOrder}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="card space-y-4 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              {t.summary}
            </p>
            <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <span>{t.subtotal}</span>
              <span>{formatPrice(cart.subtotal, cart.currency_code, locale)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <span>{t.shipping}</span>
              <span>
                {selectedShippingOptionId
                  ? formatPrice(
                      shippingOptions.find((option) => option.id === selectedShippingOptionId)
                        ?.amount ?? 0,
                      cart.currency_code,
                      locale
                    )
                  : (isEn ? "Select shipping" : "Vyber dopravu")}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--line)] pt-4 text-lg font-bold">
              <span>{t.total}</span>
              <span>
                {formatPrice(
                  cart.subtotal +
                    (shippingOptions.find((option) => option.id === selectedShippingOptionId)
                      ?.amount ?? 0),
                  cart.currency_code,
                  locale
                )}
              </span>
            </div>
          </div>

          <div className="card space-y-4 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              {t.howItWorks}
            </p>
            <ol className="space-y-3 text-sm text-[var(--muted)]">
              {t.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
