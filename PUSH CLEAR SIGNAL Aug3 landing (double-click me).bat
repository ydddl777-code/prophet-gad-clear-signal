@echo off
title Push Clear Signal - Aug 3 landing update
cd /d D:\ThreadBearMusic\prophet-gad-clear-signal
echo ==============================================================
echo    CLEAR SIGNAL - PUSH Aug 3 landing update
echo    (LLC -^> tagline, new Huldah photo, "What Clear Signal Does"
echo     bullets, Thunder Road player removed)
echo ==============================================================
echo.
echo   WARNING: Pushing to GitHub TRIGGERS THE LIVE DEPLOY to pgcs.ai.
echo   Close this window now if you do not want that yet.
echo.
pause
echo.
echo [0/4] Clearing stale git lock files (left by the sandbox)...
if exist .git\index.lock del /f /q .git\index.lock
if exist .git\HEAD.lock del /f /q .git\HEAD.lock
if exist .git\refs\heads\main.lock del /f /q .git\refs\heads\main.lock
echo.
echo [1/4] Removing the temporary backup image (not needed in repo)...
if exist client\public\images\huldah-headshot-old-backup.webp del /f /q client\public\images\huldah-headshot-old-backup.webp
echo.
echo [2/4] Staging changes...
git add -A
echo.
echo [3/4] Committing...
git commit -m "Clear Signal landing: custom wave banner image, two new Gad portraits in carousel (drop younger shot), slower 7s carousel"
echo   (If it says "nothing to commit", it is already committed - that is fine.)
echo.
echo [4/4] Pushing to GitHub - this triggers the live deploy...
git push origin main
echo.
echo ==============================================================
echo   Done. Wait ~1-2 min, then hard-refresh pgcs.ai (Ctrl+Shift+R).
echo   If you see red text / "rejected", screenshot it for Claude.
echo ==============================================================
pause
