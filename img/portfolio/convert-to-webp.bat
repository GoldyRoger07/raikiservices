@echo off
setlocal enabledelayedexpansion

REM Boucle sur tous les fichiers du dossier
for %%F in (*.jpg *.jpeg *.png) do (
    echo Conversion de %%F ...
    ffmpeg -y -i "%%F" -q:v 75 "%%~nF.webp"
)

echo.
echo Conversion terminée !
pause
