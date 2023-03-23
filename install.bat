@echo off
:: This script installs all the dependencies required to run the Solar System VR Web Application

echo Installing Dependencies for SolarSystemVR...


echo Checking NPM Version...
echo NPM Version: 
call npm --v && (
  echo ----------------
) || echo NPM is not installed! && (
  call npm install -g npm
)

cd SolarSystemVR

:: Initialise the npm with defaults
if not exist package.json (
  echo Initialising NPM project...
  call npm init -y
)

:: Install dependencies for this project
:: Webpack

echo Installing Webpack...
call npm install --save-dev webpack webpack-cli webpack-dev-server
call npm install --save-dev html-webpack-plugin copy-webpack-plugin
echo ----------------
echo Webpack Installed!
echo.

echo Installing Typescript...
call npm install --save-dev typescript ts-loader

if not exist tsconfig.json (
  :: Create an empty tsconfig file and initialise it
  echo. > tsconfig.json
)
echo ----------------
echo Typescript Installed!
echo.

pause
