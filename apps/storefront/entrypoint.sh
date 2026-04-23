#!/bin/sh
set -e

BACKEND_URL="${MEDUSA_BACKEND_URL:-http://backend:9000}"
WAIT_TIMEOUT_SECONDS="${MEDUSA_WAIT_TIMEOUT_SECONDS:-90}"

echo "Waiting for backend at ${BACKEND_URL}..."

node - "$BACKEND_URL" "$WAIT_TIMEOUT_SECONDS" <<'EOF'
const [backendUrl, timeoutSeconds] = process.argv.slice(2)

const deadline = Date.now() + Number(timeoutSeconds) * 1000

async function waitForBackend() {
  while (Date.now() < deadline) {
    try {
      const response = await fetch(backendUrl)

      if (response.ok || response.status === 404) {
        process.exit(0)
      }
    } catch {
      // Keep retrying until the backend starts listening.
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  console.error(`Backend did not become ready within ${timeoutSeconds} seconds.`)
  process.exit(1)
}

waitForBackend()
EOF

echo "Starting Next.js..."
exec node apps/storefront/server.js
