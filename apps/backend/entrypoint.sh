#!/bin/sh
set -e

MEDUSA_BIN="node ./node_modules/@medusajs/cli/cli.js"

echo "Running migrations..."
$MEDUSA_BIN db:migrate

echo "Running seed..."
npm run seed

echo "Starting Medusa..."
$MEDUSA_BIN start
