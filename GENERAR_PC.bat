@echo off
call npm install
call npm run desktop:dist
echo.
echo Instalador/portable para Windows en la carpeta dist
pause
