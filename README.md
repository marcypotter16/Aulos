# 👋 Welcome to My App

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

---

## 📦 Prerequisites

- **Node.js** (v14+) and **npm/npx**  
  👉 [Install instructions](https://kinsta.com/blog/how-to-install-node-js/)

- **Expo CLI** (optional global install)
  ```bash
  npm install --global expo-cli
  ```

- **uv** (Python package/environment manager)  
  👉 Install it via `pip install uv`

---

## 🚀 Get Started

### 🪟 Windows

1. **Install JS dependencies**  
   From the project root:

   ```bash
   npm install
   ```

2. **Start the Expo app**

   ```bash
   npx expo start
   ```

3. **Run the API (FastAPI backend)**

   ```bash
   cd API

   # Create and activate virtual environment
   uv venv .
   source .venv/bin/activate

   # Install backend dependencies
   uv sync  # or `uv install` for older versions

   # Run the FastAPI server
   uv run uvicorn main:app --reload
   ```

---

### 🐧 Linux (or macOS)

You can run the setup script:

```bash
./setup.sh
```

Then start the frontend from the project root:

```bash
npx expo start
```

---

## 📱 Open the App

After starting Expo, you'll see options to open the app in:

- A [Development Build](https://docs.expo.dev/develop/development-builds/introduction/)
- An [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- An [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) on your physical device

---

## 📚 Learn More

- [Expo Docs](https://docs.expo.dev/)
- [Expo Tutorials](https://docs.expo.dev/tutorial/introduction/)
- [Guides](https://docs.expo.dev/guides/)

---

## 💬 Join the Community

- [Expo on GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)