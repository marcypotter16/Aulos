#!/bin/bash

# Aulos Web Deployment Script
echo "🚀 Starting Aulos web deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Export web build
echo "📦 Exporting web build..."
npx expo export --platform web

if [ $? -ne 0 ]; then
    echo "❌ Web export failed!"
    exit 1
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --dir=dist --prod

if [ $? -ne 0 ]; then
    echo "❌ Netlify deployment failed!"
    exit 1
fi

echo "✅ Web deployment complete!"
echo "🔗 Your app is live at: https://aulos.netlify.app"