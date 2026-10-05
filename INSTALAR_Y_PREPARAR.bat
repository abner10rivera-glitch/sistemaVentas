@echo off
echo Instalando dependencias de la aplicacion...
call npm install
echo.
echo Preparando Android...
call npx cap add android
call npx cap sync android
echo.
echo Listo. Para abrir Android Studio: npm run android
echo Para ejecutar en PC: npm run desktop
pause
