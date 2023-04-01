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

    this.initUser();
    this.currentScene.scene.activeCamera = this.currentScene.user.camera;

    const directionalLight = new BABYLON.DirectionalLight("Directional Light", new BABYLON.Vector3(-2,-5,2), this.currentScene.scene);
    directionalLight.shadowEnabled = true;

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

  private initUser(): void
  {
    this.currentScene.user.camera.position  = new BABYLON.Vector3(0, 0, -5);
    this.currentScene.user.camera.minZ      = 0.01;

    (this.currentScene.user.camera as BABYLON.FreeCamera).speed = 0.3;

    this.currentScene.user.camera.attachControl(this.canvas, true);
  }
};