# Storefront Assets

Odporucana struktura pre staticke subory vo frontende:

- `brand/`
  Logo, favicon varianty, ikonky znacky, social preview obrazky.
- `images/`
  Vseobecne obrazky stranky, napr. homepage hero, bannery, sekcie.
- `products/`
  Docasne lokalne produktove obrazky, ak ich nechces mat este v Medusa admin.
- `video/`
  Lokalne videa pre landing page alebo produktove sekcie.

Priklady pouzitia:

- logo: `/brand/logo.svg`
- hero obrazok: `/images/home/hero.jpg`
- produktovy obrazok: `/products/stickers/forest-pack.jpg`
- video: `/video/brand/intro.mp4`

Poznamka:

- Branding a obsah stranky drz v `public/`.
- Produktove media je pre realny e-shop lepsie spravovat cez Medusa admin.
