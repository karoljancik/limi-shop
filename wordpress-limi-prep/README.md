# WordPress Limi Prep

Tento adresar je samostatna priprava pre WordPress implementaciu LIMI dizajnu.

Obsah:
- `theme/limi-atelier/` custom WordPress theme scaffold
- sablony pre homepage, shop listing a detail produktu
- pripraveny CSS smer podla aktualneho storefront dizajnu
- fallback demo data, aby sa tema dala nahodit aj bez WooCommerce dat
- `docker-compose.yml` a `.env.example` pre lokalny WordPress rozbeh
- `SETUP.md` s presnym postupom pre VS Code + Docker flow

Odporucany dalsi postup:
1. Presun tento adresar do noveho WordPress projektu.
2. Skopiruj obsah `theme/limi-atelier/` do `wp-content/themes/limi-atelier/`.
3. Aktivuj temu v administracii WordPressu.
4. Ak budes pouzivat WooCommerce, zapni plugin a prirad `Shop` stranku pre obchod.
5. Doplnenie realnych obrazkov a videa rob do `theme/limi-atelier/assets/`.
6. Ak chces rozbeh lokalne hned teraz, pozri `SETUP.md`.

Poznamka:
- Aktualny projekt v `apps/` ostava nedotknuty.
- Tato priprava je zamerne custom theme cesta, nie page builder.
