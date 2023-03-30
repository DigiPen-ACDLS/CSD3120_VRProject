/**
  @fileoverview   Implementation of an XRUser.
  @author         Diren D Bharwani, 2002216
*/

import * as BABYLON from "babylonjs";

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

  public  camera      : BABYLON.Camera;

  // TODO: Add Motion Controllers & Interactions?
};