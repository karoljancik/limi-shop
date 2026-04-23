# Limi Monorepo

Zaklad pre novy e-shop/web postaveny na `Next.js + Medusa`.

## Day 1 setup checklist

1. Nainstalovat `Node.js 20+`.
2. Overit, ze funguje `npm`.
3. Overit, ze funguje `docker compose`.
4. Rozhodnut sa, ci budeme lokalne DB pustat cez Docker.
5. Pripravit `.env` hodnoty pre backend a storefront.
6. Rozbehat `PostgreSQL`.
7. Vytvorit `Next.js` storefront v `apps/storefront`.
8. Vytvorit `Medusa` backend v `apps/backend`.
9. Pripojit backend na DB a vytvorit admin usera.
10. Vytvorit prve regiony, shipping a test produkty.
11. Napojit storefront na backend API.
12. Spravit prvy shop listing a detail produktu.

## Aktualna struktura

```txt
apps/
  backend/
  storefront/
packages/
  config/
```

## Navrhovane poradie implementacie

1. Backend a databaza
2. Produkty a kolekcie
3. Storefront listing a detail
4. Kosik
5. Checkout
6. Obsahove stranky
7. SEO a deployment

## Poznamky

- Produkty budu zdrojovo v `Medusa`.
- Obsahove stranky mozeme mat v prvej verzii priamo v `Next.js`.
- Vlastne rozsirenia backendu budeme pridavat az ked na ne vznikne realna potreba.

## Local Admin Login

- Admin URL: `http://localhost:9000/app`
- Email: `admin@limi.local`
- Password: `LimiAdmin123!`

Poznamka:
- Toto su docasne lokalne development credentials.
- Pred produkciou ich treba zmenit a nedrzat v repozitari.
