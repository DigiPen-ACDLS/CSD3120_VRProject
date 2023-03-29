/**
  @fileoverview   Implementation of the solar system WebXR application.
  @author         Diren D Bharwani, 2002216
*/

import * as BABYLON from "babylonjs";
import { WebXRApp, XRMode, XRScene } from "./app/";

export class SolarSystemVRApp extends WebXRApp
{
  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement)
  {
    // WebXRApp's ctor
    super(engine, canvas);
  }

  //===========================================================================
  // Public Member Functions
  //===========================================================================

  public async Init()
  {
    this.currentScene = new XRScene(XRMode.VR, this.engine);

    await super.Init();
  }

  public Update()
  {
    super.Update();
  }

  public Exit(): void 
  {
    super.Exit()
  }

  //===========================================================================
  // Private Member Functions
  //===========================================================================
};