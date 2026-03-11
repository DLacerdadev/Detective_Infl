#!/bin/sh
set -e

echo "==> Applying database schema..."
pnpm --filter @workspace/db run push-force

echo "==> Seeding initial game data..."
pnpm --filter @workspace/db run seed

echo "==> Starting API server..."
exec node artifacts/api-server/dist/index.cjs
