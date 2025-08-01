# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Frontend (React Native + Expo)
- **Start development server**: `npx expo start`
- **Run on Android**: `npx expo start --android` or `npm run android`
- **Run on iOS**: `npx expo start --ios` or `npm run ios`
- **Run on web**: `npx expo start --web` or `npm run web`
- **Install dependencies**: `npm install`
- **Lint code**: `npm run lint` (uses ESLint with Expo config)

## Architecture Overview

### Frontend Structure
- **Framework**: React Native with Expo Router for file-based routing
- **Navigation**: Tab-based navigation (Home, Search, Add Post, Profile)
- **State Management**: React Context for Auth and Theme management
- **Database**: Supabase for authentication and data persistence
- **Styling**: Dynamic theming with light/dark mode support

### Key Directories
- `app/`: Expo Router file-based routing structure
  - `(auth)/`: Authentication screens (login, registration)
  - `(tabs)/`: Main tab navigation screens
- `components/`: Reusable UI components (PostCard, buttons)
- `hooks/`: Context providers (AuthContext, ThemeContext)
- `models/`: TypeScript interfaces (Post, User, Review)
- `utils/`: Utility functions (ErrorUtils, StorageUtils)

### Core Context Providers
- **AuthContext**: Manages user authentication state with Supabase
- **ThemeContext**: Handles light/dark theme switching with AsyncStorage persistence

### Data Models
- **Post**: Main content model with media support (images, videos, audio)
- **User**: User profiles with authentication via Supabase
- **PostMedia**: Supports multiple media types per post

### Configuration
- Supabase credentials configured via `app.config.js` and accessed through `Constants.expoConfig.extra`
- Theme colors defined in `constants.ts` with separate light/dark schemes
- Root layout wraps app in ThemeProvider > AuthProvider > Slot structure

### Media Handling & Performance
- **Migration from expo-av to expo-video/expo-audio**: New SDK-compatible APIs for media playback
- **Manual Controls**: Audio/video use manual play/pause to prevent auto-loading issues
- **Video Thumbnails**: Thumbnail system prevents loading flickering with play overlay
- **Platform Optimization**: Web-specific DOMException prevention for audio
- **Performance**: React.memo, useMemo, useCallback optimizations prevent re-renders
- **Pagination**: Lazy loading with 10 posts per page reduces memory usage
- **Responsive Design**: Dynamic sizing for tablet/desktop screens
- **Web Animations**: Smooth CSS transitions for media navigation

### Recent Improvements
- Eliminated mobile image flickering through comprehensive memoization
- Added video thumbnail system with play button overlays
- Implemented manual audio controls to prevent web DOMException errors
- Added responsive design for tablet screens with proper media scaling
- Implemented pagination with infinite scroll and loading indicators
- Added swipe-like animations for web media navigation
- Performance optimizations with React.memo and useCallback

## TODO List
- Implement URL Renewal System