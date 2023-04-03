/**
  @fileoverview   Implementation of an XRUser.
  @author         Diren D Bharwani, 2002216
*/

// Packages
import 
{
  Camera,
  FreeCamera,
  Scene,
  UniversalCamera,
  Vector3,
  WebXRCamera
} from "babylonjs";

// Local Imports
import 
{ 
  XRScene 
} from "../app";

//=============================================================================
// Type Definitions
//=============================================================================

/**
 * Keeps track of relevant objects within the scene.
 * DOES NOT keep track of all objects in the scene. 
 * Scene elements can be accessed using Babylon's getNodeByName.
 *
 * This ObjectManager should be extended for custom behaviour.
 */
export class XRUser
{
  //===========================================================================
  // Data Members
  //===========================================================================

  public  camera : Camera;

  // TODO: Add Motion Controllers & Interactions?

  //===========================================================================
  // Constructor & Destructors
  //===========================================================================

  constructor(position: Vector3, xrScene: XRScene) /*, useWebXRCamera: boolean = false*/
  {
    this.camera = new UniversalCamera("XRUserCamera", position, xrScene.scene);
    this.camera.minZ  = 0.01;
    
    (this.camera as UniversalCamera).checkCollisions = true;

    // if (useWebXRCamera)
    // {
    //   const webXRCamera = new WebXRCamera("XRCamera", xrScene.scene, xrScene.sessionManager);
    //   webXRCamera.setTransformationFromNonVRCamera(this.camera);
    // }
  }
};