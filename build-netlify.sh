#!/bin/bash

# Exit script on any error
set -e

# Build the client
echo "Building client..."
vite build

# Build Netlify functions
echo "Building Netlify functions..."
npx esbuild netlify/functions/*.ts --bundle --platform=node --outdir=netlify/functions --format=cjs --resolve-extensions=.ts,.js --external:@google/genai --external:zod

echo "Build complete!"