@echo off
:: This script installs all the dependencies required to run the Solar System VR Web Application

echo Building SolarSystemVR...


echo Checking NPM Version...
echo NPM Version: 
call npm --v && (
  echo --------------------------------
) || echo NPM is not installed! && (
  call npm install -g npm
)

if not exist SolarSystemVR\ ( mkdir SolarSystemVR )
cd SolarSystemVR

:: Initialise the npm with defaults
if not exist package.json (
  echo Initialising NPM project...
  call npm init -y
  goto install
) else (

  echo Project has already been created!
  choice /c YN /m "Update Dependencies"
  set e=%errorlevel%
  
  if e==Y (goto update) else (goto verify)
)

:update
echo Updating Dependencies...
call npm update
echo All Dependencies Updated!
goto verify



:install 
:: Install dependencies for this project
:: Webpack

echo --------------------------------
echo Installing Webpack..
echo --------------------------------
call npm install --save-dev webpack@latest webpack-cli@latest webpack-dev-server@latest
call npm install --save-dev html-webpack-plugin@latest copy-webpack-plugin@latest
echo --------------------------------
echo Webpack Installed!
echo.

echo --------------------------------
echo Installing Typescript...
echo --------------------------------
call npm install --save-dev typescript@latest ts-loader@latest
echo --------------------------------
echo Typescript Installed!
echo.

echo --------------------------------
echo Installing BabylonJS...
echo --------------------------------
call npm install --save babylonjs@latest babylonjs-gui@latest babylonjs-loaders@latest babylonjs-materials@latest
echo --------------------------------
echo BabylonJS Installed!
echo.

echo All Dependencies Installed!
goto verify

:verify

echo Verifying files...
echo.

:: Copy config files
call xcopy /s /y ..\Config\ .\ 

if not exist src\ (
  
  echo --------------------------------
  echo Creating src directory...
  echo --------------------------------
  
  mkdir src
)

::Copy files from Source to src
call xcopy /s /y ..\Source src\

echo --------------------------------
echo Files Verified!
echo.

goto ok

:ok
echo DONE!
pause
