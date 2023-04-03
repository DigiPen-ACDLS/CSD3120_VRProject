/**
  @fileoverview   Implementation for a base web XR application.
  @author         Diren D Bharwani, 2002216
*/

// Packages
import 
{ 
  Engine 
} from "babylonjs";

// Local Imports
import 
{ 
  XRMode, 
  XRScene 
} from "./xr_scene";

/**
 * Base class for a WebXRApp. The scene needs to be initialised before being used.
 * The engine and canvas must be created outside the application.
 */
export class WebXRApp
{
  //===========================================================================
  // Data Members
  //===========================================================================

  protected engine        : Engine;
  protected canvas        : HTMLCanvasElement;

  protected currentScene  : XRScene;
  protected scenes        : Map<string, XRScene>;

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(engine: Engine, canvas: HTMLCanvasElement)
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