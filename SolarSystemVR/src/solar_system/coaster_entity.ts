/**
  @fileoverview   Implementation of a coaster entity for the solar system app.
  @author         Diren D Bharwani, 2002216
*/

// Packages
import
{ AbstractMesh, Color3, MeshBuilder, StandardMaterial } from "babylonjs";
import { XRScene } from "../app";

// Local Imports
import 
{ 
  Entity, 
  EntityCreateInfo, 
  UIText, 
  UITextCreateInfo
} from "../objects";
import { CelestialEntity } from "./celestial_entity";

//=============================================================================
// Type Definitions
//=============================================================================

export class CoasterEntity extends Entity
{
  //===========================================================================
  // Data Members
  //===========================================================================

  public    textLabel   : UIText;
  public    targetMesh  : AbstractMesh;
  public    matched     : boolean;

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(createInfo: EntityCreateInfo)
  {
    super(createInfo);

    this.matched = false;
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