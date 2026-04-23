# Limi Monorepo

Lokalny e-shop/web postaveny na `Next.js + Medusa`.

## Aktualna struktura

```txt
apps/
  backend/
  storefront/
packages/
  config/
```

## Lokalny development

Poziadavky:

- `Node.js 20+`
- `npm`
- `docker compose`

Odporucany lokalny workflow:

1. Pust backend a databazu cez Docker:

```powershell
docker compose up --build -d backend
```

2. Frontend pustaj samostatne mimo Dockeru:

```powershell
npm.cmd run dev:storefront
```

3. Otvor:

- Storefront: `http://localhost:3000`
- Medusa Admin: `http://localhost:9000/app`
- Backend API: `http://localhost:9000`

Poznamka:

- Frontend kontajner bezne netreba pustat, ak chces rychlo testovat zmeny vo frontende.
- Root endpoint backendu moze vracat `404`, co je v tomto projekte ocakavane.

## Local Admin Login

- Admin URL: `http://localhost:9000/app`
- Email: `admin@limi.local`
- Password: `LimiAdmin123!`

Poznamka:

- Toto su docasne lokalne development credentials.
- Pred produkciou ich treba zmenit a nedrzat v repozitari.

## Obrazky produktov

Lokalne storefront obrazky drz v:

`apps/storefront/public/products/stickers`

Priklad:

- subor `apps/storefront/public/products/stickers/kapi_limi.jpg`
- URL na webe `/products/stickers/kapi_limi.jpg`

Aktualne storefront vie zobrazit lokalne obrazky produktov podla `handle`, takze zmeny obrazkov vidis hned vo fronte aj bez reseedu databazy.

Seed produkty sa pripravuju v:

`apps/backend/src/scripts/seed.ts`

Poznamka:

- `seed.ts` je vhodny hlavne na prve naplnenie prazdnej databazy.
- Pri uz existujucich produktoch sa zmena v seede sama neprepise.

## Poznamky

- Produkty su zdrojovo v `Medusa`.
- Obsahove stranky mozeme mat v prvej verzii priamo v `Next.js`.
- Vlastne rozsirenia backendu budeme pridavat az ked na ne vznikne realna potreba.
