@echo off
:: Ouvre Discord s'il est installé
start "" "C:\Users\%username%\AppData\Local\Discord\Update.exe" --processStart Discord.exe

:: Attendre quelques secondes avant d'ouvrir le lien d'invitation
timeout /t 5 /nobreak >nul

:: Ouvre le lien d'invitation dans le navigateur par défaut
start "" "https://discord.gg/qT5RTp9x"

echo Discord has been opened and the invite link is in your browser.
pause
