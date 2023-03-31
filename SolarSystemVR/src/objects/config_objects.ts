/**
  @fileoverview   Implementation of configuration objects to simplify the 
                  creation of components using BabylonJS.
  @author         Diren D Bharwani, 2002216
*/

import * as BABYLON from "babylonjs";

//=============================================================================
// Type Definitions
//=============================================================================

// Create Cameras

export enum CameraType
{
  Free,
  Universal,
  Arc,        // TODO
  WebXR       // TODO
};

export class CameraConfig
{
  //===========================================================================
  // Data Members
  //===========================================================================

  public type       : CameraType;
  public position   : BABYLON.Vector3;
  public collisions : boolean;
  public name       : string;

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(type: CameraType, name: string, position: BABYLON.Vector3 = BABYLON.Vector3.Zero())
  {
    this.type       = type;
    this.position   = position;
    this.name       = name;

    // Defaults
    this.collisions = true;
  }
};