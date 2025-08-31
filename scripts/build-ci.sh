#!/bin/bash

# CI Build Script for GitHub Actions
# Sets required environment variables for build process

echo "Setting up CI environment variables..."

# Set fallback values for CI builds
export ENCRYPTION_KEY="${ENCRYPTION_KEY:-fallback-encryption-key-for-ci-builds-only}"
export HMAC_SECRET="${HMAC_SECRET:-fallback-hmac-secret-for-ci-builds-only}"
export ADMIN_SECRET_KEY="${ADMIN_SECRET_KEY:-fallback-admin-key-for-ci-builds-only}"
export CI=true
export NODE_ENV=test

echo "Running TypeScript check..."
npm run check

echo "Building frontend..."
npx vite build

echo "Building backend..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"