// app.config.js
export default {
  expo: {
    name: "Aulos",
    slug: "aulos",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "aulos",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/aulos-favicon-2.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-secure-store",
      "expo-font",
      "expo-web-browser",
      // "expo-video",
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      supabaseUrl: "https://rvdbedybxigsxyqwgnje.supabase.co",
      supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2ZGJlZHlieGlnc3h5cXdnbmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDA5NzQsImV4cCI6MjA2Nzk3Njk3NH0.H_T44w_lq7GqowxMSFreDsZYnxUUHiFGDzaCoS0WBhI"
    }
  }
};
