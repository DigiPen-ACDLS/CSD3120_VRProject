@echo off
:: This script installs all the dependencies required to run the Solar System VR Web Application

echo Installing Dependencies for SolarSystemVR...


echo Checking NPM Version...
echo NPM Version: 
call npm --v && (
  echo --------------------------------
) || echo NPM is not installed! && (
  call npm install -g npm
)

cd SolarSystemVR

:: Initialise the npm with defaults
if not exist package.json (
  echo Initialising NPM project...
  call npm init -y
  goto install
) else (
  echo Updating Dependencies...
  call npm update
  echo All Dependencies Updated!
  goto ok
)

: install 
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
goto ok

:ok

:: Check if tsconfig exists
if not exist tsconfig.json (

  :: Create and initialise tsconfig.json with the following
  (
    echo {
    echo   "compilerOptions": {
    echo   /* Language and Environment */
    echo   "target": "es2016",                         /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    echo   "lib": ["es6"],                             /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    echo.  
    echo   /* Modules */
    echo   "module": "commonjs",                       /* Specify what module code is generated. */
    echo   "rootDir": "src",                           /* Specify the root folder within your source files. */
    echo   "resolveJsonModule": true,                  /* Enable importing .json files. */
    echo.
    echo   /* JavaScript Support */
    echo   "allowJs": true,                            /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
    echo.
    echo   /* Emit */
    echo   "outDir": "dist",                           /* Specify an output folder for all emitted files. */
    echo.
    echo   /* Interop Constraints */
    echo   "esModuleInterop": true,                    /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    echo   "forceConsistentCasingInFileNames": true,   /* Ensure that casing is correct in imports. */
    echo.
    echo   /* Type Checking */
    echo   "strict": true,                             /* Enable all strict type-checking options. */
    echo   "noImplicitAny": true,                      /* Enable error reporting for expressions and declarations with an implied 'any' type. */
    echo.  
    echo   /* Completeness */
    echo   "skipLibCheck": true                        /* Skip type checking all .d.ts files. */
    echo   }
    echo }
  ) > tsconfig.json
)

echo DONE!
pause
