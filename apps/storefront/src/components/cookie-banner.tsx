"use client";

import { useEffect, useState } from "react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("limi-cookie-consent");
    if (!consent) {
      // Delay visibility for a smoother entrance
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("limi-cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("limi-cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-wrapper">
      <div className="cookie-banner">
        <div className="cookie-banner__content">
          <div className="cookie-banner__icon">🍪</div>
          <div className="cookie-banner__text-group">
            <h4 className="cookie-banner__title">Pouzivame cookies</h4>
            <p className="cookie-banner__description">
              Tento web pouziva cookies na zlepsenie uzivatelskeho zazitku a analyzu navstevnosti. 
              Pouzivanim webu suhlasis s ich ukladanim.
            </p>
          </div>
        </div>
        <div className="cookie-banner__actions">
          <button onClick={handleDecline} className="cookie-banner__btn cookie-banner__btn--secondary">
            Odmietnut
          </button>
          <button onClick={handleAccept} className="cookie-banner__btn cookie-banner__btn--primary">
            Suhlasim
          </button>
        </div>
      </div>
    </div>
  );
}
