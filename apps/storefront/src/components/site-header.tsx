"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Domov" },
  { href: "/shop", label: "Obchod" },
  { href: "/kosik", label: "Kosik" },
];

export function SiteHeader() {
  const pathname = usePathname();
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

  const cloudOffset = scrollY * 0.18;
  const bubbleOffset = scrollY * 0.12;
  const sparkleOffset = scrollY * 0.24;
  const isCondensed = scrollY > 24;

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
        <Link href="/" className="site-header__brand">
          <Image
            src="/brand/logos/black_logo.png"
            alt="LiMi"
            width={160}
            height={80}
            className="site-header__logo h-auto w-auto"
            priority
          />
          <span className="site-header__brand-text">
            Nalepky pre male ruky a velku fantaziu
          </span>
        </Link>

        <nav className="site-header__nav" aria-label="Hlavna navigacia">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`site-header__nav-link${isActive ? " is-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/shop" className="site-header__cta">
            Objavit nalepky
          </Link>
        </nav>
      </div>
    </header>
  );
}
