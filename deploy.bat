@echo off
echo.
echo ====================================
echo   Life Coach - Quick Deploy
echo ====================================
echo.
echo Adding changes to git...
git add .
echo.
echo Committing...
set /p message="Enter commit message (or press Enter for 'Update'): "
if "%message%"=="" set message=Update
git commit -m "%message%"
echo.
echo Pushing to GitHub...
git push
echo.
echo ====================================
echo   DEPLOYED! 
echo   Wait 30 seconds, then refresh iPhone
echo ====================================
echo.
pause
