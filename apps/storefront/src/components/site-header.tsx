"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader({ lang = "sk" }: { lang?: string }) {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(Math.min(window.scrollY, 180));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { href: `/${lang}`, label: lang === "en" ? "Home" : "Domov" },
    { href: `/${lang}/shop`, label: lang === "en" ? "Shop" : "Obchod" },
    { href: `/${lang}/cart`, label: lang === "en" ? "Cart" : "Košík" },
  ];

  const cloudOffset = scrollY * 0.18;
  const bubbleOffset = scrollY * 0.12;
  const sparkleOffset = scrollY * 0.24;
  const isCondensed = scrollY > 24;

  const brandText = lang === "en" 
    ? "Stickers for small hands and big imagination"
    : "Nálepky pre malé ruky a veľkú fantáziu";
  
  const ctaText = lang === "en" ? "Discover Stickers" : "Objaviť nálepky";

  return (
    <header className={`site-header${isCondensed ? " is-condensed" : ""}`}>
      <div className="site-header__glow" aria-hidden="true" />
      <div
        className="site-header__cloud site-header__cloud--left"
        aria-hidden="true"
        style={{ transform: `translate3d(0, ${cloudOffset}px, 0)` }}
      />
      <div
        className="site-header__cloud site-header__cloud--right"
        aria-hidden="true"
        style={{ transform: `translate3d(0, ${bubbleOffset}px, 0)` }}
      />
      <div
        className="site-header__bubble site-header__bubble--peach"
        aria-hidden="true"
        style={{ transform: `translate3d(0, ${bubbleOffset}px, 0)` }}
      />
      <div
        className="site-header__bubble site-header__bubble--mint"
        aria-hidden="true"
        style={{ transform: `translate3d(0, ${sparkleOffset}px, 0)` }}
      />
      <div
        className="site-header__sparkle site-header__sparkle--left"
        aria-hidden="true"
        style={{ transform: `translate3d(0, ${sparkleOffset}px, 0) rotate(${scrollY * 0.08}deg)` }}
      />
      <div
        className="site-header__sparkle site-header__sparkle--right"
        aria-hidden="true"
        style={{ transform: `translate3d(0, ${cloudOffset}px, 0) rotate(${-scrollY * 0.06}deg)` }}
      />

      <div className="site-header__inner">
        <Link href={`/${lang}`} className="site-header__brand">
          <Image
            src="/brand/logos/black_logo.png"
            alt="LiMi"
            width={160}
            height={80}
            className="site-header__logo"
            priority
          />
          <span className="site-header__brand-text">
            {brandText}
          </span>
        </Link>

        <nav className="site-header__nav" aria-label="Hlavná navigácia">
          <div className="mr-4">
            <LanguageSwitcher currentLocale={lang} />
          </div>
          {navItems.map((item) => {
            const isActive =
              item.href === `/${lang}`
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`site-header__nav-link${isActive ? " is-active" : ""}`}
              >
                {item.label}
                {item.href.includes("/cart") && itemCount > 0 && (
                  <span className="site-header__cart-badge">{itemCount}</span>
                )}
              </Link>
            );
          })}
          <Link href={`/${lang}/shop`} className="site-header__cta">
            {ctaText}
          </Link>
        </nav>
      </div>
    </header>
  );
}
