@echo off
title Push Clear Signal to GitHub
cd /d D:\ThreadBearMusic\prophet-gad-clear-signal
echo ==============================================================
echo    CLEAR SIGNAL - PUSH OVERNIGHT FIXES TO GITHUB
echo ==============================================================
echo.
echo   The overnight fixes are already committed locally.
echo   This script pushes them to GitHub.
echo.
echo   WARNING: Pushing to GitHub TRIGGERS THE LIVE DEPLOY.
echo   Close this window now if you do not want that yet.
echo.
pause
echo.
echo [0/3] Clearing any stale git lock files from the overnight session...
if exist .git\index.lock del /f /q .git\index.lock
if exist .git\stale-lock-1 del /f /q .git\stale-lock-1
if exist .git\stale-lock-2 del /f /q .git\stale-lock-2
if exist .git\index.lock.stale-jun10 del /f /q .git\index.lock.stale-jun10
echo.
echo [1/3] Staging any remaining changes...
git add -A
echo.
echo [2/3] Committing...
git commit -m "Clear Signal: About page fix, upload page formatting, full PDF report, secure env (Jul 29 overnight)"
echo   (If it says "nothing to commit", the overnight commit already exists - that is fine.)
echo.
echo [3/3] Pushing to GitHub - this triggers the live deploy...
git push origin main
echo.
echo ==============================================================
echo   Done. If you see an error above (red text / "rejected"),
echo   take a screenshot and send it to Claude.
echo ==============================================================
pause
