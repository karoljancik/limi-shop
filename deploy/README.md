# Production Deploy Prep

These files prepare the project for a production-like deploy on one server with separate containers for:

- `storefront`
- `backend`
- `postgres`
- `redis`
- `caddy`

## Before first use

1. Copy `.env.production.example` to `.env.production`
2. Fill in real secrets and URLs
3. Copy `deploy/Caddyfile.example` to `deploy/Caddyfile`
4. Replace placeholder domains before exposing ports `80/443`

## Scripts

- `deploy/deploy.ps1`: build and start the full stack
- `deploy/migrate.ps1`: run Medusa migrations manually
- `deploy/seed.ps1`: run the seed manually
- `deploy/backup-postgres.ps1`: create a SQL dump in `docker-data/backups`

## Notes

- The production compose file does not publish Postgres or Redis to the host.
- The backend no longer seeds automatically unless `RUN_SEED_ON_BOOT=true`.
- Caddy is included so the stack is ready for custom domains and HTTPS later.
