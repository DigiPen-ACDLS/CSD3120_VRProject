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
  UniversalCamera
} from "babylonjs";

// Local Imports
import 
{ 
  XRScene 
} from "../app";

import 
{
  CameraType, 
  CameraConfig 
} from "./config_objects";

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

  private scene       : Scene;    // The scene the user is tied to.
  public  camera      : Camera;

  // TODO: Add Motion Controllers & Interactions?

  //===========================================================================
  // Constructor & Destructors
  //===========================================================================

  constructor(xrscene: XRScene)
  {
    this.scene = xrscene.scene;
  }

  //===========================================================================
  // Member Functions
  //===========================================================================

  public CreateCamera(cameraInfo: CameraConfig)
  {
    switch (cameraInfo.type)
    {
      case CameraType.Free:
      {
        this.camera       = new FreeCamera(cameraInfo.name, cameraInfo.position, this.scene, true);
        this.camera.minZ  = 0.01;

        (this.camera as FreeCamera).checkCollisions = cameraInfo.collisions;

        break;
      }
      case CameraType.Universal:
      {
        this.camera = new UniversalCamera(cameraInfo.name, cameraInfo.position, this.scene);
        this.camera.minZ  = 0.01;

        (this.camera as UniversalCamera).checkCollisions = cameraInfo.collisions;

        break;
      }
      default:
      {
        console.log("This camera has not been implemented or an invalid type was passed in!!");
        
        break;
      }
    }
  }
};