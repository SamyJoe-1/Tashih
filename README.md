# Islamic App

Flutter app (`islamic_app`, package `com.example.islamic_app`). Requires Dart SDK `^3.12.2`.

## Build an APK

### 1. Install the tools
- **Flutter SDK** (stable, with Dart >= 3.12.2): https://docs.flutter.dev/install
- **JDK 17** (`java -version`)
- **Android SDK**: install Android Studio, or only the command-line tools, then:
  ```bash
  sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0"
  flutter config --android-sdk /path/to/Android/Sdk
  flutter doctor --android-licenses
  ```
- Check everything: `flutter doctor` (Flutter and Android toolchain must be green).

### 2. Get the code
```bash
git clone -b app https://github.com/SamyJoe-1/Tashih.git
cd Tashih
flutter pub get
```

### 3. Build
Debug APK (for testing):
```bash
flutter build apk --debug
```

Release APK (unsigned-for-store, signed with debug key, fine for sideloading):
```bash
flutter build apk --release
```

Smaller per-CPU APKs:
```bash
flutter build apk --release --split-per-abi
```

Output: `build/app/outputs/flutter-apk/app-release.apk`
(or `app-arm64-v8a-release.apk` etc. with `--split-per-abi`).

### 4. Install on a phone
```bash
adb install build/app/outputs/flutter-apk/app-release.apk
```
Or copy the APK to the phone and open it (allow "Install unknown apps").

## Signed release (Play Store)
1. Create a keystore:
   ```bash
   keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
   ```
2. Create `android/key.properties` (never commit it):
   ```
   storePassword=<password>
   keyPassword=<password>
   keyAlias=upload
   storeFile=/home/you/upload-keystore.jks
   ```
3. Configure signing in `android/app/build.gradle.kts` (see https://docs.flutter.dev/deployment/android#sign-the-app), then:
   ```bash
   flutter build appbundle --release   # .aab for Play Store
   ```
4. Before publishing, change `applicationId` / `namespace` from `com.example.islamic_app` to your own id.

## Troubleshooting
- `flutter doctor` complaints -> fix those first.
- Gradle/JDK errors -> make sure JDK 17 is used (`flutter config --jdk-dir <path>`).
- Stale build -> `flutter clean && flutter pub get`.
