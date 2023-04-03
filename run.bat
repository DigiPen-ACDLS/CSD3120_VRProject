@echo off
:: This script installs all the dependencies required to run the Solar System VR Web Application

echo Building SolarSystemVR...


echo Checking NPM Version...
echo NPM Version: 
call npm --v && (
  echo --------------------------------
)

cd SolarSystemVR
if not exist node_modules\ ( call npm install )

: run
echo Running SolarSystemVR...
call npm run start

pause