import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { CartProvider } from "@/components/cart-provider";
import { CookieBanner } from "@/components/cookie-banner";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Limi",
    description:
      lang === "en"
        ? "Playful 3D stickers for peaceful creation and children's imagination."
        : "Hravé 3D nálepky pre pokojné tvorenie a detskú fantáziu.",
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <CartProvider>
          <SiteHeader lang={lang} />
          <main className="flex-1">{children}</main>
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
