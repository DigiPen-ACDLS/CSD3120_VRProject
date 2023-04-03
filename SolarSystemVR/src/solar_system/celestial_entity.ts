/**
  @fileoverview   Implementation of a celestial entity for the solar system app.
  @author         Leonard Lee, 369369369
*/

// Packages
import
{ 
  AbstractMesh,
  ActionManager,
  ExecuteCodeAction,
  PointerDragBehavior, 
  Scene, 
  Texture, 
  Vector3
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

export enum LabelState
{
  OFF,
  ON_HOVER,
  ALWAYS_ON
};

/**
 * Encapsulates a celestial body for the solar system app
 */
export class CelestialEntity extends Entity
{
  //===========================================================================
  // Data Members
  //===========================================================================

  public    textLabel       : UIText;

  private   verticalDrag    : PointerDragBehavior;
  private   horizontalDrag  : PointerDragBehavior;

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(createInfo: EntityCreateInfo, xrScene: XRScene)
  {
    super(createInfo);

    // Create drag behaviours
    this.verticalDrag   = new PointerDragBehavior( {dragAxis: Vector3.Up() }); 
    this.horizontalDrag = new PointerDragBehavior( {dragPlaneNormal: Vector3.Up() });

    if (this.mesh)
    {
      this.mesh.actionManager  = new ActionManager(xrScene.scene);
    }
  }

  //===========================================================================
  // Member Functions
  //===========================================================================

  public CreateLabel(createInfo: UITextCreateInfo, xrScene: XRScene, state: LabelState)
  {
    this.textLabel = new UIText(createInfo, xrScene.scene);

    if (this.mesh != null)
    {
      this.mesh.addChild(this.textLabel.plane);
    }
  }

  public SetLabelState(state: LabelState)
  {
    switch (state)
    {
      case LabelState.OFF:
      {
        this.textLabel.plane.isVisible      = false;
        this.textLabel.textBlock.isVisible  = false;

        break;
      }
      case LabelState.ON_HOVER:
      {
        this.mesh.actionManager?.registerAction
        (
          new ExecuteCodeAction
          (
            ActionManager.OnPointerOverTrigger, 
            
            (event) =>
            {
              // TODO: Show Text
            }
          )
        );
        
        this.mesh.actionManager?.registerAction
        (
          new ExecuteCodeAction
          (
            ActionManager.OnPointerOutTrigger, 
            
            (event) =>
            {
              // TODO: Hide Text
            }
          )
        );

        break;
      }
      case LabelState.ALWAYS_ON:
      {
        this.textLabel.plane.isVisible      = true;
        this.textLabel.textBlock.isVisible  = true;

        break;
      }
    }


    
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
};