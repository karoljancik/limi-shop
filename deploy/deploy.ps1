$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root ".env.production"
$composeFile = Join-Path $root "docker-compose.production.yml"
$caddyExample = Join-Path $root "deploy\\Caddyfile.example"
$caddyFile = Join-Path $root "deploy\\Caddyfile"

if (-not (Test-Path $envFile)) {
  Write-Error "Missing $envFile. Copy .env.production.example to .env.production first."
}

if (-not (Test-Path $caddyFile)) {
  Copy-Item -LiteralPath $caddyExample -Destination $caddyFile
  Write-Host "Created deploy\\Caddyfile from example. Adjust domains before internet exposure."
}

Write-Host "Building and starting production stack..."
docker compose --env-file $envFile -f $composeFile up --build -d

Write-Host "Services:"
docker compose --env-file $envFile -f $composeFile ps
