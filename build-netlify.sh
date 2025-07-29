#!/bin/bash

# Build the client
echo "Building client..."
vite build

# Build Netlify functions
echo "Building Netlify functions..."
mkdir -p netlify/functions
npx esbuild netlify/functions/generate-script.ts --bundle --platform=node --outfile=netlify/functions/generate-script.js --external:@google/genai

echo "Build complete!"