$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root ".env.production"
$composeFile = Join-Path $root "docker-compose.production.yml"

if (-not (Test-Path $envFile)) {
  Write-Error "Missing $envFile. Copy .env.production.example to .env.production first."
}

docker compose --env-file $envFile -f $composeFile run --rm backend npm run seed
