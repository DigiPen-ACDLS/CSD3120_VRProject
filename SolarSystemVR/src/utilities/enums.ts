/**
 * @author    Diren D Bharwani
 * @param     StudentID: 2002216
 * 
 * Definitions of useful enums.
 */

/**
 * Determines the direction a 2D plane faces towards the camera.
 */
export enum BillboardMode
{
  None  = 0x0,
  X     = 0x1,
  Y     = 0x2,
  Z     = 0x4,
  ALL   = 0x7
};

/**
 * Determines the mode for starting an XR app in.
 */
export enum XRMode
{
  VR    = 0x0,
  AR    = 0x1
};