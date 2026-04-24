# Local Setup

Tento starter je pripraveny tak, aby si ho vedel rozbehat lokalne vo VS Code cez Docker.

## 1. Priprava

1. skopiruj `.env.example` na `.env`
2. skontroluj porty a pristupy
3. otvor adresar `wordpress-limi-prep` vo VS Code

## 2. Spustenie

V tomto adresari spusti:

```powershell
docker compose up -d
```

Potom otvor:
- WordPress: `http://localhost:8090`
- phpMyAdmin: `http://localhost:8091`

## 3. Aktivacia temy

Po instalacii WordPressu:
1. chod do `Appearance > Themes`
2. aktivuj `Limi Atelier`
3. vytvor stranky `Domov`, `Shop`, `Pribeh znacky`, `Kontakt`
4. `Domov` nastav ako static front page
5. `Shop` prirad WooCommerce ako obchodnu stranku

## 4. Odporucane pluginy

- `WooCommerce`
- `Classic Editor` alebo `Gutenberg` podla preferencie
- `WPForms` alebo `Contact Form 7`
- `Advanced Custom Fields` ak budes chciet jemnejsie riadenie obsahu

## 5. Co je uz pripravene

- custom theme scaffold
- homepage v style aktualneho storefrontu
- custom `Shop` page starter
- WooCommerce archive a single product starter
- page templates pre `Brand Story` a `Contact`
- Customizer polia pre hero texty a header tagline

## 6. Co bude dalsi krok implementacie

- doplnit realne produktove galerie a obrazky
- napojit WooCommerce fields na obsah, ktory mas dnes v storefronte
- upravit header/footer navigaciu podla realnej struktury webu
- doladit typografiu, ikony a finalne assety
