/**
 * @author    Diren D Bharwani
 * @param     StudentID: 2002216
 * 
 * Implementation of the UIText Component class.
 */

import 
{
  Mesh,
  MeshBuilder,
  Scene,
  Vector2,
  Vector3 
} from "babylonjs";

import 
{ 
  AdvancedDynamicTexture,
  TextBlock 
} from "babylonjs-gui";

import 
{
  BillboardMode
} from "../utilities/enums"

//=============================================================================
// Type Definitions
//=============================================================================

/**
 * Information for creating the a UIText component.
 */
export class UITextCreateInfo
{
  //===========================================================================
  // Data Members
  //===========================================================================

  public  captureMove     : boolean;
  public  fontSize        : number;
  public  uiTextName      : string;
  public  text            : string;
  public  planeDimensions : Vector2;
  public  planePosition   : Vector3;
  public  planeRotation   : Vector3; // Euler Angles Y->X->Z
  public  billboardmode   : BillboardMode;

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(name: string)
  {
    this.captureMove      = false;
    this.fontSize         = 32;

    this.uiTextName       = name;
    this.text             = "";

    this.planePosition    = Vector3.Zero();
    this.planeRotation    = Vector3.Zero();

    this.planeDimensions  = Vector2.One();
    this.billboardmode    = BillboardMode.None;
  }
};

/**
 * Encapsulates a UI Text Element to be rendered into the scene.
 */
export class UIText
{
  //===========================================================================
  // Data Members
  //===========================================================================

  public plane     : Mesh;
  public texture   : AdvancedDynamicTexture;
  public textBlock : TextBlock;

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(createInfo: UITextCreateInfo, scene: Scene) 
  { 
    // Appended strings for sub-components
    const TEXT_PLANE_NAME = createInfo.uiTextName + "_plane";
    const TEXT_NAME       = createInfo.uiTextName + "_text";

    // Create a Plane to display the text on
    this.plane = MeshBuilder.CreatePlane
    (
      TEXT_PLANE_NAME, 
      {
      width:  createInfo.planeDimensions.x,
      height: createInfo.planeDimensions.y
      }, 
      scene
    );

    // Set Transform Info
    this.plane.billboardMode  = createInfo.billboardmode; 

    // Create texture for rendering the text to
    const TEXTURE_DIMENSIONS = createInfo.planeDimensions.scale(100);
    this.texture = AdvancedDynamicTexture.CreateForMesh
    (
      this.plane, 
      TEXTURE_DIMENSIONS.x, 
      TEXTURE_DIMENSIONS.y, 
      createInfo.captureMove   // Whether to capture move events
    );

    this.textBlock              = new TextBlock(TEXT_NAME, createInfo.text);
    this.textBlock.fontSize     = createInfo.fontSize;
    this.textBlock.textWrapping = true;
    
    // Set Default colours
    this.texture.background = "white";
    this.textBlock.color    = "black";

    this.texture.addControl(this.textBlock);
  }

  //===========================================================================
  // Member Functions
  //===========================================================================



};