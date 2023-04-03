/**
  @fileoverview   Implementation of a coaster entity for the solar system app.
  @author         Diren D Bharwani, 2002216
*/

// Packages
import
{

} from "babylonjs";
import { XRScene } from "../app";

// Local Imports
import 
{ 
  Entity, 
  EntityCreateInfo, 
  UIText, 
  UITextCreateInfo
} from "../objects";

//=============================================================================
// Type Definitions
//=============================================================================

export class CoasterEntity extends Entity
{
  //===========================================================================
  // Data Members
  //===========================================================================

  public    textLabel       : UIText;

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(createInfo: EntityCreateInfo)
  {
    super(createInfo);
  }

  public CreateLabel(createInfo: UITextCreateInfo, xrScene: XRScene)
  {
    this.textLabel = new UIText(createInfo, xrScene.scene);

    if (this.mesh != null)
    {
      this.mesh.addChild(this.textLabel.plane);
    }

    this.textLabel.plane.position = createInfo.planePosition;
    this.textLabel.plane.rotation = createInfo.planeRotation;
  }
}