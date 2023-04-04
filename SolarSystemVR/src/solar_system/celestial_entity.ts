/**
  @fileoverview   Implementation of a celestial entity for the solar system app.
  @author         Diren D Bharwani, 2002216
                  Austen Ang Xuan Ming, 2001774
*/

// Packages
import
{ 
  AbstractMesh,
  ActionManager,
  Animation,
  ExecuteCodeAction,
  Mesh,
  MeshBuilder,
  PointerDragBehavior, 
  Scene, 
  StandardMaterial, 
  Texture, 
  Vector3
} from "babylonjs";

import 
{
   AdvancedDynamicTexture
   , Control, Rectangle
   , TextBlock
} from "babylonjs-gui";

// Local Imports
import 
{ 
  XRScene 
} from "../app";

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

  private   rotateAnimation : Animation;
  private   floatAnimation  : Animation;

  public    label           : TextBlock;
  public    textRect        : Rectangle;
  public    sphereCollider  : AbstractMesh;

  private   verticalDrag    : PointerDragBehavior;
  private   horizontalDrag  : PointerDragBehavior;

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(createInfo: EntityCreateInfo, xrScene: XRScene)
  {
    super(createInfo);
    this.mesh.checkCollisions = true;
    this.mesh.isPickable      = true;

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

  public CreateLabel(text: string, xrScene: XRScene)
  {
    this.textRect = new Rectangle(this.name + "_textRect");
    xrScene.fullscreenUI.addControl(this.textRect);
    this.textRect.width             = "300px";
    this.textRect.height            = "200px";
    this.textRect.thickness         = 2;
    this.textRect.linkOffsetX       = "150px";
    this.textRect.linkOffsetY       = "-100px";
    this.textRect.transformCenterX  = 0;
    this.textRect.transformCenterY  = 1;  
    this.textRect.background        = "White";
    this.textRect.alpha             = 0.9;
    this.textRect.scaleX            = 0;
    this.textRect.scaleY            = 0;
    this.textRect.cornerRadius      = 30
    this.textRect.linkWithMesh(this.sphereCollider);

    this.label = new TextBlock(this.name + "_label");
    this.label.text                   = text;
    this.label.color                  = "Black";
    this.label.fontSize               = 14;
    this.label.textWrapping           = true;
    this.label.textVerticalAlignment  = Control.VERTICAL_ALIGNMENT_TOP;
    this.label.alpha                  = 1.0;
    this.label.paddingTop             = "20px";
    this.label.paddingBottom          = "20px";
    this.label.paddingLeft            = "20px";
    this.label.paddingRight           = "20px";

    this.textRect.addControl(this.label);

    const scaleXAnimation = new Animation(this.label.name + "_scaleXAnim", "scaleX", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
    const scaleYAnimation = new Animation(this.label.name + "_scaleYAnim", "scaleY", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);

    const keyFrames = [];

    keyFrames.push
    (
      {
        frame: 0,
        value: 0
      }
    );

    keyFrames.push
    (
      {
        frame: 10,
        value: 1
      }
    );

    scaleXAnimation.setKeys(keyFrames);
    scaleYAnimation.setKeys(keyFrames);
    this.textRect.animations = [];
    this.textRect.animations.push(scaleXAnimation);
    this.textRect.animations.push(scaleYAnimation);

    this.sphereCollider.actionManager?.registerAction
    (
      new ExecuteCodeAction
      (
        ActionManager.OnPointerOverTrigger, 
        () =>
        {
          xrScene.scene.beginAnimation(this.textRect, 0, 10, false);
        }
      )
    );
    
    this.sphereCollider.actionManager?.registerAction
    (
      new ExecuteCodeAction
      (
        ActionManager.OnPointerOutTrigger, 
        () =>
        {
          xrScene.scene.beginAnimation(this.textRect, 10, 0, false);
        }
      )
    );
  }

  public AddCollider(xrScene: XRScene)
  {
    if (this.mesh != null)
    {
      this.sphereCollider = MeshBuilder.CreateSphere(this.name + "_collider", { diameter: 1, segments: 32}, xrScene.scene);
      this.sphereCollider.actionManager = new ActionManager(xrScene.scene);

      (this.sphereCollider as Mesh).checkCollisions = true;
      (this.sphereCollider as Mesh).position        = new Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
      (this.sphereCollider as Mesh).isVisible       = true;

      // HACK: Make a transparent material for the sphere
      const sphereMaterial = new StandardMaterial(this.name + "_sphereColliderMat", xrScene.scene);
      sphereMaterial.alpha = 0.0;
      
      this.sphereCollider.material = sphereMaterial;
      sphereMaterial.freeze();

      this.mesh.addChild(this.sphereCollider);
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

  public StartAnimations(xrScene: XRScene)
  {
    this.rotateAnimation = new Animation
    ( 
      this.name + '_rotationAnim', 
      'rotation', 
      60,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    this.floatAnimation = new Animation
    (
      this.name + '_positionAnim',
      'position',
      60,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const keyFrames = [
        {frame: 0, value    : this.mesh.rotation},
        {frame: 120, value  : this.mesh.rotation.add(new Vector3(0, Math.PI * 2, 0))}
    ]

    const keyPosFrames = [
        {frame: 0, value    : this.mesh.position},
        {frame: 60, value   : this.mesh.position.add(new Vector3(0, 0.2, 0))},
        {frame: 120, value  : this.mesh.position}
    ]

    this.rotateAnimation.setKeys(keyFrames);
    this.floatAnimation.setKeys(keyPosFrames);

    this.mesh.animations = [];
    this.mesh.animations.push(this.rotateAnimation);
    this.mesh.animations.push(this.floatAnimation);

    xrScene.scene.beginAnimation(this.mesh, 0, 120, true);
  }

  public MoveToSpaceAnimation(finalPosition: Vector3, scalingFactor: number, xrScene: XRScene)
  {
    const planetScaling = new Animation
    (
      this.name + "_scalingAnimation", 
      "scaling",
      60,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const planetMove = new Animation
    (
      this.name + "_positionAnimation", 
      "position",
      60,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const keyframes = [
      {frame: 0, value    : this.mesh.scaling },
      {frame: 360, value  : this.mesh.scaling.multiply(new Vector3(scalingFactor, scalingFactor, scalingFactor))}
    ]

    const posKeyFrames = [
      {frame: 0, value    : this.mesh.position  },
      {frame: 360, value  : finalPosition       }
    ]

    planetScaling.setKeys(keyframes);
    planetMove.setKeys(posKeyFrames);
    this.mesh.animations = [];
    this.mesh.animations.push(planetScaling);
    this.mesh.animations.push(planetMove);

    xrScene.scene.beginAnimation(this.mesh, 0, 360, false);
  }
};