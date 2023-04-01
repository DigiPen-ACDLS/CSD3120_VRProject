/**
  @fileoverview   Entry point for the application.
  @author         Diren D Bharwani, 2002216
*/

import * as BABYLON from "babylonjs";
import { SolarSystemVRApp } from "./solar_system_app";
import { SandboxVR } from "./sandbox";

async function main(): Promise<void>
{
  // Create a canvas to render to and a babylonjs engine.

  const renderCanvas    : HTMLCanvasElement = document.getElementById("renderCanvas") as HTMLCanvasElement;
  const babylonEngine   : BABYLON.Engine    = new BABYLON.Engine(renderCanvas, true, { deterministicLockstep: true, lockstepMaxSteps: 4 } );

  // Set up the application

  // const solarSystemApp  = new SolarSystemVRApp(babylonEngine, renderCanvas);

  // solarSystemApp.Init();
  // solarSystemApp.Update();
  // solarSystemApp.Exit();

  const testApp = new SandboxVR(babylonEngine, renderCanvas);

  await testApp.Init();
  testApp.Update();

  window.addEventListener("resize", () => { babylonEngine.resize() });

  testApp.Exit();
}

// Run main
main();


