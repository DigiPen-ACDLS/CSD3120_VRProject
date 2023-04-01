@echo off
:: This script installs all the dependencies required to run the Solar System VR Web Application

echo Building SolarSystemVR...


echo Checking NPM Version...
echo NPM Version: 
call npm --v && (
  echo --------------------------------
) || echo NPM is not installed! && (
  call npm install
)

if not exist SolarSystemVR\ ( mkdir SolarSystemVR )
cd SolarSystemVR

:: Initialise the npm with defaults
choice /c YN /m "Update Dependencies"
set e=%errorlevel%

if e==Y (goto update) else (goto run)

: update
echo Updating Dependencies...
call npm update
echo All Dependencies Updated!
goto run

: run
echo Running SolarSystemVR...
call npm run start

pause