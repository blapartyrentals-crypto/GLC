#!/usr/bin/env bash
# Validate the monorepo: install, lint, typecheck, test.
set -uo pipefail

echo "==> pnpm install"
pnpm install

echo "==> pnpm lint"
pnpm lint

echo "==> pnpm typecheck"
pnpm typecheck

echo "==> pnpm test"
pnpm test

echo "All validation steps passed."