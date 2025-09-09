#!/bin/bash

# Render deployment script (alternative to Docker)
echo "🚀 Deploying to Render..."

# Set Node version
echo "📦 Using Node 18..."
export NODE_VERSION=18

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false --no-audit --no-fund

# Build application
echo "🔨 Building application..."
npm run build

echo "✅ Build complete! Ready to start..."