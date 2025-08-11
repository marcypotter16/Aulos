#!/bin/bash

# Aulos Android Deployment Script
echo "📱 Starting Aulos Android build..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if EAS CLI is available
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Please install with: npm install -g @expo/eas-cli"
    exit 1
fi

# Check if user is logged in to EAS
if ! eas whoami &> /dev/null; then
    echo "❌ Not logged in to EAS. Please run: eas login"
    exit 1
fi

echo "🔨 Building Android APK..."
eas build --platform android --profile production-android

if [ $? -ne 0 ]; then
    echo "❌ Android build failed!"
    exit 1
fi

echo "✅ Android build complete!"
echo "📱 Check your EAS dashboard for the APK download link"
echo "🔗 Or run: eas build:list --platform android --limit 1"