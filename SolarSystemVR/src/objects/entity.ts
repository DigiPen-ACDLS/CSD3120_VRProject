/**
  @fileoverview   Implementation of a simple entity.
  @author         Leonard Lee, 369369369
*/


// Packages
import 
{ 
  AbstractMesh, 
  Material, 
  PointerDragBehavior, 
  Scene, 
  StandardMaterial, 
  Texture, 
  Vector2, 
  Vector3 
} from "babylonjs";
import { TextWrapping } from "babylonjs-gui";
import { ThinSprite } from "babylonjs/Sprites/thinSprite";
import { BillboardMode } from "../utilities/enums";

// Local Imports
import 
{ 
  UIText, 
  UITextCreateInfo 
} from "./ui_text";

//=============================================================================
// Type Definitions
//=============================================================================

export class EntityCreateInfo
{
  public    name            : string;
  public    mesh            : AbstractMesh;
  public    texture         : Texture;
  public    material        : Material;

  constructor(entityName: string)
  {
    this.name = entityName;
    
    // Nulled
    this.mesh     = null;
    this.texture  = null;
    this.material = null;
  }
}

/**
 * Encapsulates an entity in the scene.
 */
export class Entity
{
  //===========================================================================
  // Data Members
  //===========================================================================

  public    name            : string;
  public    mesh            : AbstractMesh;
  public    material        : Material;
  public    texture         : Texture;
  
  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(createInfo: EntityCreateInfo)
  {
    this.name = createInfo.name;

    this.mesh     = createInfo.mesh;

    // Attach the texture to the material and material to the mesh
    if (createInfo.material != null)
    {
      this.material = createInfo.material;

      if (createInfo.texture != null)
      {
        this.texture = createInfo.texture;
        // Assign texture to material
        (this.material as StandardMaterial).diffuseTexture = this.texture;
      }

      this.mesh.material = this.material;
    }
  }

  public AddUITextPlane(name : string, 
    options:
    {
      position?   : Vector3,
      rotation?   : Vector3,
      fontSize?   : number,
      planeDim?   : Vector2,
      billboard?  : BillboardMode,
    }
    , scene : Scene)
  {
    const uiCreateInfo = new UITextCreateInfo(name);
    uiCreateInfo.fontSize           = options.fontSize || 32;
    uiCreateInfo.planeDimensions    = options.planeDim || new Vector2(4.5, 2.5);
    uiCreateInfo.planePosition      = new Vector3(0, 0, 0);
    uiCreateInfo.planeRotation      = new Vector3(0, 0, 0);
    uiCreateInfo.billboardmode      = options.billboard || BillboardMode.None;
    uiCreateInfo.text               = "Hello World";
    
    this.textLabel = new UIText(uiCreateInfo, scene);
    this.mesh.addChild(this.textLabel.plane);
    this.textLabel.plane.position = options.position || new Vector3(0, 0, 0);
    this.textLabel.plane.rotation = options.rotation || new Vector3(0, 0, 0);
  }
}