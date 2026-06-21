# Chai Tap Challenge - Android Play Store Compilation Guide ☕📱

This directory contains the **complete production-ready Android Studio project wrapper** for your game. It uses an immersive, fullscreen native WebView, locks the orientation to portrait, implements wake locks, displays a native splash screen on boot, and supports back button interrupts with a double exit prompt.

---

## 📂 Project Structure Overview

Here are the files we have pre-configured of your app:
- `app/src/main/AndroidManifest.xml` - Manifest with locked portrait, hardware acceleration, wake lock, and launch intent declarations.
- `app/src/main/java/com/chaitap/challenge/MainActivity.kt` - Kotlin Controller with web settings (JS + LocalStorage enabled), fullscreen WindowInset setups, splash control, and native Dialog back button exits.
- `app/src/main/res/layout/activity_main.xml` - Layout including the immersive full-viewport WebView and native splash overlay.
- `app/src/main/res/drawable/` - Vector adaptive launcher graphics (`ic_launcher_foreground.xml` / `background`).
- `build.gradle.kts` files - Gradle configuration set up for target API Level 34 (Android 14).

---

## 🚀 Step-by-Step Production Guide

### 1. Build Your Web App Assets
Before building the APK, you need to compile your modern React app into static, standalone HTML/JS bundles.
1. Run this build command in your terminal of this project folder:
   ```bash
   npm run build
   ```
2. This creates a folder named `dist` containing `index.html`, assets, and media files.

---

### 2. Import into Android Studio & Add Web Assets
1. Open **Android Studio** (Koala, Hedgehog or newer).
2. Choose **Open an Existing Project** and select the `/android` folder from this repository.
3. Wait for the initial Gradle sync to finish successfully.
4. In the Project pane, go to **app** -> **src** -> **main**.
5. Right-click on **main** -> **New** -> **Folder** -> **Assets Folder**, and click **Finish**.
6. This creates a folder named `assets` at `app/src/main/assets`.
7. **Copy everything** inside your compiled `dist/` directory (from Step 1) and paste it directly into this new `assets/` folder.
   * *Your assets path should look exactly like: `app/src/main/assets/index.html`*

---

### 3. Build & Test Debug APK
To test the game draft on your actual physical phone or an emulator:
1. Enable **Developer Options** and reference **USB Debugging** on your Android phone.
2. Select **Run** -> **Run 'app'** from the top menu of Android Studio.
3. To generate a shareable debug APK, go to:
   * **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
4. After compiling, Android Studio will display a popup. Click **Locate** to find your compiled `app-debug.apk` file. Put it on your phone to play!

---

### 4. Create and Sign Release Build (For Google Play Store)
Google Play Store requires a signed **Android App Bundle (.aab)** format instead of standard APK.

1. In Android Studio, click **Build** -> **Generate Signed Bundle / APK...**
2. Choose **Android App Bundle** and click **Next**.
3. Under **Key store path**, click **Create new...** to create a secure digital signature:
   - Provide a safe path (e.g., `/user/keys/chaitap.jks`).
   - Create a strong password (keep this safe, you will need this for all future updates!).
   - Provide an Alias (e.g., `chaitap_key`) and define its validity (25 years is standard).
   - Click **OK**.
4. Check the **Remember passwords** box and click **Next**.
5. Select **release** destination and click **Create**.
6. Find your finalized signed bundle inside `app/release/app-release.aab`.

---

### 5. Uploading to Google Play Console
1. Go to your [Google Play Console](https://play.google.com/console).
2. Click **Create app** and configure details (AppName: **Chai Tap Challenge**, Category: **Game / Arcade**).
3. Complete the Initial setups questionnaires (Target Age group 13+, Content rating, etc.).
4. Navigate to **Production** under the Release section on the sidebar.
5. Create a new release, and **drag & drop** your generated `app-release.aab` bundle.
6. Submit your release for Review! Your immersive cutting-chai adventure is ready to go live! ☀️🏆
