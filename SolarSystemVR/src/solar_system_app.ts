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

  public async Init(): Promise<void>
  {
    this.currentScene = new XRScene(XRMode.VR, this.engine);

    this.createUser();

    await super.Init();
  }

  public Update(): void
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

  private createUser(): void
  {
    const userCamera = new BABYLON.UniversalCamera
    (
      "user_camera", 
      new BABYLON.Vector3(0, 0, -20), 
      this.currentScene.scene
    );

    userCamera.checkCollisions    = true;
    this.currentScene.user.camera = userCamera;
  }
};