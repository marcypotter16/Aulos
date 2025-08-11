#!/bin/bash

# Aulos Universal Deployment Script
echo "🚀 Aulos Deployment Manager"
echo "=========================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Function to show usage
show_usage() {
    echo "Usage: $0 [web|android|both]"
    echo ""
    echo "Options:"
    echo "  web     - Deploy web version to Netlify"
    echo "  android - Build Android APK using EAS"
    echo "  both    - Deploy both web and Android versions"
    echo "  (no args) - Interactive mode"
    echo ""
}

# Function for web deployment
deploy_web() {
    echo "🌐 Deploying web version..."
    ./scripts/deploy-web.sh
    return $?
}

# Function for Android deployment
deploy_android() {
    echo "📱 Building Android version..."
    ./scripts/deploy-android.sh
    return $?
}

# Make scripts executable
chmod +x scripts/deploy-web.sh 2>/dev/null
chmod +x scripts/deploy-android.sh 2>/dev/null

# Handle command line arguments
case "${1:-interactive}" in
    "web")
        deploy_web
        ;;
    "android")
        deploy_android
        ;;
    "both")
        echo "🚀 Deploying both platforms..."
        deploy_web
        if [ $? -eq 0 ]; then
            echo ""
            deploy_android
        else
            echo "❌ Web deployment failed, skipping Android build"
            exit 1
        fi
        ;;
    "interactive"|"")
        echo "What would you like to deploy?"
        echo "1) Web only"
        echo "2) Android only"
        echo "3) Both platforms"
        read -p "Choose (1-3): " choice
        
        case $choice in
            1)
                deploy_web
                ;;
            2)
                deploy_android
                ;;
            3)
                deploy_web
                if [ $? -eq 0 ]; then
                    echo ""
                    deploy_android
                else
                    echo "❌ Web deployment failed, skipping Android build"
                    exit 1
                fi
                ;;
            *)
                echo "❌ Invalid choice"
                exit 1
                ;;
        esac
        ;;
    "--help"|"-h")
        show_usage
        ;;
    *)
        echo "❌ Unknown option: $1"
        show_usage
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"