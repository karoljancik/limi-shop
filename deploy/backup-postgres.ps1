$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root ".env.production"
$composeFile = Join-Path $root "docker-compose.production.yml"
$backupDir = Join-Path $root "docker-data\\backups"

if (-not (Test-Path $envFile)) {
  Write-Error "Missing $envFile. Copy .env.production.example to .env.production first."
}

if (-not (Test-Path $backupDir)) {
  New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFile = Join-Path $backupDir "postgres-$timestamp.sql"

Write-Host "Creating PostgreSQL backup at $backupFile"
docker compose --env-file $envFile -f $composeFile exec -T postgres sh -lc "pg_dump -U \"$POSTGRES_USER\" \"$POSTGRES_DB\"" | Out-File -FilePath $backupFile -Encoding utf8

Write-Host "Backup complete."
