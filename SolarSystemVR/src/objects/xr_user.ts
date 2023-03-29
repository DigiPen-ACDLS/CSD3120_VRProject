/**
  @fileoverview   Implementation of an XRUser.
  @author         Diren D Bharwani, 2002216
*/

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
  public  moveSpeed   : number;

  contructor(moveSpeed: number)
  {
    this.moveSpeed = 0.5;
  }
};