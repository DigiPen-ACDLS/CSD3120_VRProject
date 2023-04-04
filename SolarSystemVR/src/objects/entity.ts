/**
  @fileoverview   Implementation of a simple entity.
  @author         Leonard Lee, 2001896
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
}