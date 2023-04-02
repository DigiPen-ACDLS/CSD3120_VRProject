/**
  @fileoverview   Implementation of a simple entity.
  @author         Leonard Loser, 369369369
*/


// Packages
import 
{ 
  AbstractMesh, 
  Material, 
  PointerDragBehavior, 
  Scene, 
  Texture, 
  Vector3 
} from "babylonjs";

// Local Imports
import 
{ 
  UIText, 
  UITextCreateInfo 
} from "./ui_text";

//=============================================================================
// Type Definitions
//=============================================================================

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
  public    texture         : Texture;
  public    material        : Material;
  public    textLabel       : UIText;

  private   verticalDrag    : PointerDragBehavior;
  private   horizontalDrag  : PointerDragBehavior;
    
  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(objectName : string, mesh: AbstractMesh)
  {
    this.name = objectName;
    this.mesh = mesh;

    // Create drag behaviours
    this.verticalDrag   = new PointerDragBehavior( {dragAxis: Vector3.Up() }); 
    this.horizontalDrag = new PointerDragBehavior( {dragPlaneNormal: Vector3.Up() });
  }

  //===========================================================================
  // Member Functions
  //===========================================================================

  public CreateLabel(createInfo: UITextCreateInfo, scene: Scene)
  {
    this.textLabel = new UIText(createInfo, scene);
  }

  public SetDraggable(draggable: boolean): void
  {
    if (this.mesh == null)
    {
      console.log(this.name + " is missing a Mesh! Unable to SetDraggable!");
      return;
    }

    if (!draggable)
    {
      // Since vertical drag is the default, we remove that.
      this.mesh.removeBehavior(this.verticalDrag);
    }
    else
    {
      this.verticalDrag.onDragStartObservable.add
      (
        (event)=>
        { 
          // We only allow vertical drag when the pointer is above the middle of the entity.
          // Otherwise, we drag it horizontally along the XZ plane.
          if (event.dragPlanePoint.y < this.mesh.position.y)
          {
            const dragID = this.verticalDrag.currentDraggingPointerId;
            this.verticalDrag.detach();
            this.horizontalDrag.attach(this.mesh);
            this.horizontalDrag.startDrag(dragID);
          }
        }
      );

      this.horizontalDrag.onDragEndObservable.add
      (
        ()=>
        {
          // Once horizontal dragging stops, we revert back to vertical drag by default.
          this.horizontalDrag.detach();
          this.verticalDrag.attach(this.mesh);
        }
      );

      // Default is vertical drag.
      this.mesh.addBehavior(this.verticalDrag);
    }
  }

}