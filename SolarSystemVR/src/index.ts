/**
  @fileoverview   Entry point for the application.
  @author         Diren D Bharwani, 2002216
*/

// Packages
import { Engine } from "babylonjs";

// Local Imports
import { SolarSystemVRApp } from "./solar_system_app";
import { SandboxVR } from "./sandbox";


async function main(): Promise<void>
{
  // Create a canvas to render to and a babylonjs engine.

  const renderCanvas    : HTMLCanvasElement = document.getElementById("renderCanvas") as HTMLCanvasElement;
  const babylonEngine   : Engine            = new Engine(renderCanvas, true, { deterministicLockstep: true, lockstepMaxSteps: 4 } );

  // solarSystem(babylonEngine, renderCanvas);
  sandbox(babylonEngine, renderCanvas);
}

async function solarSystem(engine: Engine, canvas: HTMLCanvasElement)
{
  const solarSystemApp  = new SolarSystemVRApp(engine, canvas);
  await solarSystemApp.Init();

  solarSystemApp.Update();
  window.addEventListener("resize", () => { engine.resize() });

  solarSystemApp.Exit();
}

async function sandbox(engine: Engine, canvas: HTMLCanvasElement)
{
  const testApp = new SandboxVR(engine, canvas);
  await testApp.Init();

  testApp.Update();
  window.addEventListener("resize", () => { engine.resize() });

  testApp.Exit();
}

// Run main
main();


