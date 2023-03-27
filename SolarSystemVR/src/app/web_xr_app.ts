/**
  @fileoverview   Implementation for a base web XR application.
  @author         Diren D Bharwani, 2002216
*/

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
  // Getter / Setters
  //===========================================================================

  GetCurrentScene()
  {
    return this.currentScene;
  }

  GetScene(sceneName: string)
  {
    return this.scenes.get(sceneName);
  }

  SetCurrentScene(sceneName: string)
  {
    const sceneToSet = this.scenes.get(sceneName);
    if (sceneToSet)
      this.currentScene = sceneToSet;
  }

  //===========================================================================
  // Member Functions
  //===========================================================================

  CreateScene(sceneName: string, mode: XRMode = XRMode.VR)
  {
    this.scenes.set(sceneName, new XRScene(mode, this.engine));

    const sceneTypeString = mode === XRMode.VR ? "VRScene" : "ARScene";
    console.log("Created " + sceneName + " " + sceneTypeString);
  }

  


}