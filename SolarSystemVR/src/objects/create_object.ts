/**
  @fileoverview   Implementation for a configuration objects when creating objects for a scene.
  @author         Diren D Bharwani, 2002216
*/

import * as BABYLON from "babylonjs";

//=============================================================================
// Type Definitions
//=============================================================================

// Camera Config Objects

export enum CameraType
{
  Universal,
  Arc,
}

export class CameraConfig
{
  public type       : CameraType;
  public position   : BABYLON.Vector3;
  public rotation   : BABYLON.Vector3;
  public ellipsoid  : BABYLON.Vector3;
  public gravity    : boolean;
  public collide    : boolean;
};

