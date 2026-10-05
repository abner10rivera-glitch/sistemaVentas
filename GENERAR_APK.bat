@echo off
call npm install
if not exist android (
  call npx cap add android
)
call npx cap sync android
cd android
call gradlew.bat assembleDebug
echo.
echo APK generada en:
echo android\app\build\outputs\apk\debug\app-debug.apk
pause
