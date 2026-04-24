#!/bin/sh
set -e

MEDUSA_BIN="node ./node_modules/@medusajs/cli/cli.js"
RUN_SEED_ON_BOOT="${RUN_SEED_ON_BOOT:-false}"

echo "Running migrations..."
$MEDUSA_BIN db:migrate

if [ "$RUN_SEED_ON_BOOT" = "true" ]; then
  echo "Running seed..."
  npm run seed
else
  echo "Skipping seed. Set RUN_SEED_ON_BOOT=true to seed on startup."
fi

echo "Starting Medusa..."
$MEDUSA_BIN start
