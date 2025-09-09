#!/bin/bash

# Render deployment startup script
echo "🚀 Starting Render deployment..."

# Install dependencies and build
echo "📦 Installing dependencies..."
npm ci --production=false

echo "🔨 Building application..."
npm run build

echo "✅ Build complete! Starting production server..."
cd .next/standalone && node server.js