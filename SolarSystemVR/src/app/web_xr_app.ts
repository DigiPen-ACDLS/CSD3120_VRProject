/**
  @fileoverview   Implementation for a base web XR application.
  @author         Diren D Bharwani, 2002216
*/

import * as BABYLON from "babylonjs";
import { XRMode, XRScene } from "./xr_scene";

/**
 * Base class for a WebXRApp. The scene needs to be initialised before being used.
 * The engine and canvas must be created outside the application.
 */
export class WebXRApp
{
  //===========================================================================
  // Data Members
  //===========================================================================

  protected engine        : BABYLON.Engine;
  protected canvas        : HTMLCanvasElement;

  protected currentScene  : XRScene;
  protected scenes        : Map<string, XRScene>;

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement)
  {
    this.engine = engine;
    this.canvas = canvas;
  }

  //===========================================================================
  // Member Functions
  //===========================================================================

  public async Init(): Promise<void>
  {
    await this.currentScene.InitXR(true);
  }

  public Update(): void
  {
    this.engine.runRenderLoop(() => {
      this.currentScene.scene.render();
    });
  }

  public Exit(): void
  {

  }
}