# Aulos Deployment Guide

Complete guide for deploying your Aulos app prototype for testing and production.

## 🚀 Quick Start for Testing with Friends

### 1. EAS Development Build (Recommended for Testing)

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to your Expo account
eas login

# Initialize EAS in your project
eas build:configure

# Create development builds for testing
eas build --platform android --profile development
eas build --platform ios --profile development

# Share the build links with your friends
```

## 📱 Platform-Specific Deployment

### Android (Google Play Store)

#### Development/Testing Build
```bash
# Create internal testing build
eas build --platform android --profile preview

# Or production build
eas build --platform android --profile production
```

#### Play Store Setup
1. **Create Google Play Console Account** ($25 one-time fee)
2. **Upload APK/AAB** from EAS build
3. **Internal Testing Track** for friends testing
4. **Production Track** for public release

### iOS (App Store)

#### Development/Testing Build  
```bash
# Create TestFlight build
eas build --platform ios --profile preview

# Or production build
eas build --platform ios --profile production
```

#### App Store Setup
1. **Apple Developer Account** ($99/year)
2. **App Store Connect** setup
3. **TestFlight** for beta testing with friends
4. **App Store** for public release

### 🌐 Web Deployment

#### Option 1: Netlify (Recommended)
```bash
# Build for web
npx expo export -p web

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --dir=dist --prod
```

#### Option 2: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npx expo export -p web
vercel --prod
```

#### Option 3: Expo Hosting (Simple)
```bash
# Deploy directly to Expo
npx expo export -p web
eas submit --platform web
```

## 🔧 EAS Configuration

Create/update `eas.json`:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "buildConfiguration": "Debug"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      },
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

## 📋 Step-by-Step for Testing with Friends

### Immediate Testing (5 minutes)

1. **Web Version** (Fastest):
   ```bash
   npx expo start --web
   # Share the localhost URL or deploy to Netlify
   ```

2. **Expo Go App** (Development):
   ```bash
   npx expo start
   # Friends scan QR code with Expo Go app
   ```

### Professional Testing (30 minutes)

1. **Android Internal Testing**:
   ```bash
   eas build --platform android --profile preview
   # Upload to Play Console Internal Testing
   # Share testing link with friends
   ```

2. **iOS TestFlight**:
   ```bash
   eas build --platform ios --profile preview
   eas submit --platform ios
   # Add friends to TestFlight
   ```

## 🔐 Environment Variables

Update `app.config.js` for different environments:

```javascript
export default {
  expo: {
    name: process.env.NODE_ENV === 'production' ? 'Aulos' : 'Aulos Dev',
    slug: 'aulos',
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      environment: process.env.NODE_ENV || 'development'
    },
    // ... other config
  }
};
```

## 📊 Deployment Options Comparison

| Platform | Cost | Setup Time | Best For |
|----------|------|------------|----------|
| Web (Netlify) | Free | 5 min | Immediate sharing |
| Expo Go | Free | 2 min | Quick testing |
| Android APK | Free | 15 min | Android testing |
| Play Store | $25 | 30 min | Professional Android |
| TestFlight | $99/year | 45 min | iOS testing |
| App Store | $99/year | 1+ hour | Professional iOS |

## 🚨 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied (triggers)
- [ ] App icons and splash screens added
- [ ] Privacy policy and terms of service ready
- [ ] Supabase RLS policies configured
- [ ] Error tracking setup (Sentry recommended)
- [ ] Analytics setup (optional)

## 🔗 Useful Commands

```bash
# Check build status
eas build:list

# View build logs
eas build:view [build-id]

# Cancel build
eas build:cancel [build-id]

# Submit to stores
eas submit --platform android
eas submit --platform ios

# Update app without rebuilding (for JS/config changes)
eas update
```

## 📱 Quick Share Links

Once built, EAS provides shareable links:
- **Android**: Direct APK download link
- **iOS**: TestFlight invitation link  
- **Web**: Hosted URL

## 💡 Pro Tips

1. **Start with web deployment** - fastest for initial feedback
2. **Use development builds** for testing with native features
3. **Set up internal tracks** before public release
4. **Test on real devices** before store submission
5. **Use EAS Update** for quick fixes without rebuilding

## 🆘 Common Issues

- **iOS Simulator builds don't work on real devices** - use device builds
- **Android APK won't install** - enable "Install from unknown sources"
- **Web deployment 404** - check routing configuration
- **Supabase connection fails** - verify environment variables

Choose your deployment strategy based on urgency and audience! For quick testing with friends, start with web + Expo Go, then move to proper builds for app store testing.