import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import nodemailer from "nodemailer";

type CheckoutNotifyBody = {
  currency_code: string;
  customer_name: string;
  email: string;
  items: Array<{
    quantity: number;
    title: string;
  }>;
  order_display_id: number;
  total: number;
};

function getBankTransferDetails(orderDisplayId: number) {
  return {
    account_name: process.env.BANK_TRANSFER_ACCOUNT_NAME || "Limi",
    bank_name: process.env.BANK_TRANSFER_BANK_NAME || "Dopln BANK_TRANSFER_BANK_NAME",
    iban: process.env.BANK_TRANSFER_IBAN || "Dopln BANK_TRANSFER_IBAN",
    swift: process.env.BANK_TRANSFER_SWIFT || "Dopln BANK_TRANSFER_SWIFT",
    payment_reference: process.env.BANK_TRANSFER_REFERENCE_PREFIX
      ? `${process.env.BANK_TRANSFER_REFERENCE_PREFIX}${orderDisplayId}`
      : String(orderDisplayId),
  };
}

function formatAmount(total: number, currencyCode: string) {
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(total / 100);
}

function buildTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number.parseInt(process.env.SMTP_PORT, 10) : null;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !from) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });
}

export async function POST(
  req: MedusaRequest<CheckoutNotifyBody>,
  res: MedusaResponse
) {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
  const body = req.body;
  const bankTransfer = getBankTransferDetails(body.order_display_id);
  const amount = formatAmount(body.total, body.currency_code);
  const itemLines = body.items
    .map((item) => `<li>${item.title} x ${item.quantity}</li>`)
    .join("");

  const transport = buildTransport();
  const from = process.env.SMTP_FROM;

  if (!transport || !from) {
    logger.warn(
      `Checkout email skipped for order #${body.order_display_id}: SMTP is not configured.`
    );

    res.status(200).json({
      bank_transfer: bankTransfer,
      email_sent: false,
      message:
        "Objednavka je vytvorena. SMTP este nie je nastavene, preto sa e-mail s platobnymi udajmi neposlal.",
    });
    return;
  }

  try {
    await transport.sendMail({
      from,
      to: body.email,
      subject: `LIMI objednavka #${body.order_display_id} - bankovy prevod`,
      text: [
        `Ahoj ${body.customer_name || ""},`,
        "",
        `dakujeme za objednavku #${body.order_display_id}.`,
        `Suma na uhradu: ${amount}`,
        "",
        "Platobne udaje:",
        `Prijemca: ${bankTransfer.account_name}`,
        `Banka: ${bankTransfer.bank_name}`,
        `IBAN: ${bankTransfer.iban}`,
        `SWIFT: ${bankTransfer.swift}`,
        `Variabilny symbol: ${bankTransfer.payment_reference}`,
        "",
        "Objednane polozky:",
        ...body.items.map((item) => `- ${item.title} x ${item.quantity}`),
        "",
        "Po prijati platby budeme objednavku spracovavat.",
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #332c3a;">
          <h2>LIMI objednavka #${body.order_display_id}</h2>
          <p>Ahoj ${body.customer_name || ""}, dakujeme za objednavku.</p>
          <p><strong>Suma na uhradu:</strong> ${amount}</p>
          <h3>Platobne udaje</h3>
          <p><strong>Prijemca:</strong> ${bankTransfer.account_name}</p>
          <p><strong>Banka:</strong> ${bankTransfer.bank_name}</p>
          <p><strong>IBAN:</strong> ${bankTransfer.iban}</p>
          <p><strong>SWIFT:</strong> ${bankTransfer.swift}</p>
          <p><strong>Variabilny symbol:</strong> ${bankTransfer.payment_reference}</p>
          <h3>Objednane polozky</h3>
          <ul>${itemLines}</ul>
          <p>Po prijati platby budeme objednavku spracovavat.</p>
        </div>
      `,
    });

    res.status(200).json({
      bank_transfer: bankTransfer,
      email_sent: true,
      message: "Platobne udaje sme poslali na zadany e-mail.",
    });
  } catch (emailError) {
    logger.error(
      `Failed to send checkout email for order #${body.order_display_id}: ${
        emailError instanceof Error ? emailError.message : String(emailError)
      }`
    );

    res.status(200).json({
      bank_transfer: bankTransfer,
      email_sent: false,
      message:
        "Objednavka je vytvorena, ale e-mail s platobnymi udajmi sa nepodarilo odoslat. Skontrolujte SMTP nastavenia.",
    });
  }
}
