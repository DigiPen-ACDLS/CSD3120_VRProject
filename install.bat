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


set state=%errorlevel%
:: Initialise the npm with defaults
if not exist package.json (
  echo Initialising NPM project...
  call npm init -y
  set state=Installing
  goto install
) else (
  echo NPM Project Initialised! Updating Dependencies...
  set state=Updating
  goto update
)

: install 
:: Install dependencies for this project
:: Webpack

echo %state% Webpack...
call npm install --save-dev webpack@latest webpack-cli@latest webpack-dev-server@latest
call npm install --save-dev html-webpack-plugin@latest copy-webpack-plugin@latest
echo ----------------
echo Webpack Installed!
echo.

echo %state% Typescript...
call npm install --save-dev typescript@latest ts-loader@latest

if not exist tsconfig.json (  
  :: Create and initialise tsconfig
  call npx tsc --init --rootDir src --outDir build --esModuleInterop --resolveJsonModule --lib es6 --module commonjs --allowJs true --noImplicitAny true
)
echo ----------------
echo Typescript Installed!
echo.

echo %state% BabylonJS...
call npm install --save babylonjs@latest babylonjs-gui@latest babylonjs-loaders@latest babylonjs-materials@latest
echo ----------------
echo BabylonJS Installed!
echo.

echo All Dependencies Installed!
goto ok

:update

echo %state% Dependencies...
call npm update

echo All Dependencies Updated!
goto ok


:ok
pause
