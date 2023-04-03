/**
  @fileoverview   Implementation of the solar system WebXR application.
  @author         Diren D Bharwani, 2002216
                  <fill in your name Leonard>
*/

// Packages
import 
{ 
  AbstractMesh,
  Animation,
  Color3,
  Engine, 
  HemisphericLight,
  Mesh,
  MeshBuilder,
  PhotoDome,
  UniversalCamera,
  Vector2,
  Vector3 
} from "babylonjs";

import 'babylonjs-loaders';

// Local Imports

import 
{ 
  AssetLoader,
  WebXRApp, 
  XRMode, 
  XRScene 
} from "../app/";

import 
{
  Entity,
  EntityCreateInfo,
  UIText,
  UITextCreateInfo
} from "../objects";

import 
{
  CelestialEntity,
  CoasterEntity,
  PlanetInfo,
  TargetEntity
} from "../solar_system";

import 
{ 
  BillboardMode 
} from "../utilities";

import { Control, TextWrapper, TextWrapping } from "babylonjs-gui";
import { meshFragmentDeclaration } from "babylonjs/Shaders/ShadersInclude/meshFragmentDeclaration";

//=============================================================================
// Type Definitions
//=============================================================================

/**
 * The Solar System WebXR Application
 */
export class SolarSystemVRApp extends WebXRApp
{
  //===========================================================================
  // Data Members
  //===========================================================================

  private assetLoader : AssetLoader;
  private entities    : Map<string, Entity>;
  private targets     : TargetEntity[];

  private planetInfo  : PlanetInfo;

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(engine: Engine, canvas: HTMLCanvasElement)
  {
    // WebXRApp's ctor
    super(engine, canvas);

    this.entities = new Map<string, Entity>();
    this.targets  = [];

    this.planetInfo = new PlanetInfo();
  }

  //===========================================================================
  // Public Member Functions
  //===========================================================================

  public async Init(): Promise<void>
  {
    this.currentScene = new XRScene(XRMode.VR, this.engine);
    this.currentScene.scene.autoClear = false;

    await super.Init();

    // //Enable Gizmo
    // const gizmoManager = new GizmoManager(this.currentScene.scene);
    // gizmoManager.positionGizmoEnabled = true;

    this.initUser();
    
    // Manually create a light
    const hemisphericLight      = new HemisphericLight('Light', new Vector3(-1, 1, 0), this.currentScene.scene);
    hemisphericLight.intensity  = 1.0;
    hemisphericLight.diffuse    = new Color3(1, 1, 1);

    await this.loadModelsAndCreateEntities();
    await this.setPlatforms();
    await this.setPlanets();
    await this.createRoof();
    await this.createButton();
    await this.createWhiteboard();
   }
    

  public Update(): void
  {
    super.Update();
  }

  public Exit(): void 
  {
    super.Exit()
  }

  //===========================================================================
  // Private Member Functions
  //===========================================================================

  private initUser(): void
  {
    this.currentScene.CreateDefaultUser(new Vector3(28, 32, -7), new Vector3(-113.35, 47.5, 0));
    (this.currentScene.user.camera as UniversalCamera).speed    = 1.0;

    this.currentScene.user.camera.attachControl(this.canvas, true);
    this.currentScene.scene.activeCamera = this.currentScene.user.camera;
  }

  private async loadModelsAndCreateEntities(): Promise<void>
  {
    new PhotoDome
    (
      "space_dome", 
      "assets/textures/Skybox/space_skydome.jpg",
      {
          resolution : 32,
          size: 10000,
          useDirectMapping : false
      },
      this.currentScene.scene
    );

    //Assets
    this.assetLoader = new AssetLoader(this.currentScene.scene);

    const filepaths = 
    [
      'assets/solarsystem/mercury.glb',
      'assets/solarsystem/venus.glb',
      'assets/solarsystem/earth.glb',
      'assets/solarsystem/mars.glb',
      'assets/solarsystem/jupiter.glb',
      'assets/solarsystem/saturn.glb',
      'assets/solarsystem/uranus.glb',
      'assets/solarsystem/neptune.glb',
      'assets/solarsystem/moon.glb',
      'assets/models/the_design_lab.glb',
      'assets/models/sci_fi_platform.glb'
    ];
    
    const names = 
    [
      "Mercury"   , // 0
      "Venus"     , // 1
      "Earth"     , // 2
      "Mars"      , // 3
      "Jupiter"   , // 4
      "Saturn"    , // 5
      "Uranus"    , // 6
      "Neptune"   , // 7
      'Moon'      , // 8
      'lab'       , // 9
      'platform0'   // 10
    ];

    const promises      = await this.assetLoader.LoadMeshes(filepaths, names);
    const loadedMeshes  = await Promise.all(promises);

    // 9 celestial entities (8 planets)
    for (let i = 0; i < 8; ++i)
    {
      const celestialInfo = new EntityCreateInfo(names[i]);
      celestialInfo.mesh = loadedMeshes[i];

      this.entities.set(names[i], new CelestialEntity(celestialInfo, this.currentScene));
      (this.entities.get(names[i]) as CelestialEntity).SetDraggable(true);
    }

    // Moon
    const moonInfo = new EntityCreateInfo(names[8]);
    moonInfo.mesh = loadedMeshes[8];

    this.entities.set(names[8], new CelestialEntity(moonInfo, this.currentScene));

    // Lab
    const labInfo = new EntityCreateInfo(names[9]);
    labInfo.mesh = loadedMeshes[9];
    this.entities.set(names[9], new Entity(labInfo));

    // Platform
    const platformInfo = new EntityCreateInfo(names[10]);
    platformInfo.mesh = loadedMeshes[10];
    this.entities.set(names[10], new CoasterEntity(platformInfo));
  }

  private setPlatforms(): void
  {
    // Set for platform0
    this.entities.get('platform0').mesh.scaling.setAll(0.2);
    this.entities.get('platform0').mesh.position = new Vector3(-12.2, 17.5, -6.0);

    // Set for other platforms
    for(let i = 1; i < 8; ++i)
    {
      const platformInfo = new EntityCreateInfo('platform' + i.toString());
      platformInfo.mesh = this.entities.get('platform0').mesh.clone(platformInfo.name, null);
      platformInfo.mesh.scaling.setAll(0.2);
      platformInfo.mesh.position = new Vector3(-12.2, 17.5, 6 * (i-1));

      this.entities.set('platform' + i.toString(), new CoasterEntity(platformInfo));
    }

    let names = [
      "Mercury",
      "Venus"  ,
      "Earth"  ,
      "Mars"   ,
      "Jupiter",
      "Saturn" ,
      "Uranus" ,
      "Neptune",
    ];

    let targetScales = [
      0.5,
      0.5,
      0.8,
      0.5,
      1.5,
      1.5,
      1.0,
      1.0
    ];

    for(let i = 0; i < 8; ++i)
    {
      const platform = this.entities.get('platform' + i.toString());

      // Targets
      this.targets.push(new TargetEntity(this.entities.get(names[i]) as CelestialEntity, this.currentScene));
      (this.targets[i].mesh as Mesh).position = new Vector3(platform.mesh.position.x, platform.mesh.position.y + 2, platform.mesh.position.z);
      (this.targets[i].mesh as Mesh).scaling.setAll(targetScales[i]);

      // Labels
      const labelInfo = new UITextCreateInfo(platform.name);
      labelInfo.planePosition   = new Vector3(-20, 3, 0);
      labelInfo.planeRotation   = new Vector3(Math.PI / 2, Math.PI / 2, 0);
      labelInfo.planeDimensions = new Vector2(4.5, 2.5)
      labelInfo.fontSize        = 64;
      labelInfo.text            = names[i];

      (platform as CoasterEntity).CreateLabel(labelInfo, this.currentScene);
    }
  }

  private setPlanets(): void
  {
    let names = [
      "Mercury"   , // 0
      "Venus"     , // 1
      "Earth"     , // 2
      "Mars"      , // 3
      "Jupiter"   , // 4
      "Saturn"    , // 5
      "Uranus"    , // 6
      "Neptune"   , // 7
      'Moon'      , // 8
    ];

    let planetPositions = [
      new Vector3(-6.2, 19.5, -6.0 ),    // mercury
      new Vector3(-12.2, 19.5, 0.0  ),    // venus  
      new Vector3(-12.2, 19.5, 6.0  ),    // earth  
      new Vector3(-12.2, 19.5, 12.0 ),    // mars   
      new Vector3(-12.2, 20.2, 18.0 ),    // jupiter
      new Vector3(-12.2, 20.2, 24.0 ),    // saturn 
      new Vector3(-12.2, 20.2, 30.0 ),    // uranus 
      new Vector3(-12.2, 19.9, 36.0 ),    // neptune
      new Vector3( 700 , 700 , 0    ),    // moon   
    ];

    let planetScales = [
      1.2   , // mercury
      0.4   , // venus  
      0.001 , // earth  
      0.5   , // mars   
      0.07  , // jupiter
      0.0025, // saturn 
      0.01  , // uranus 
      0.12  , // neptune
      0.3   , // moon   
    ];

    let labelPositions = [
      new Vector3(0, 7    , 0),   // mercury
      new Vector3(0, 21   , 0),   // venus  
      new Vector3(0, 8400 , 0),   // earth  
      new Vector3(0, 16.8 , 0),   // mars   
      new Vector3(0, 110  , 0),   // jupiter
      new Vector3(0, 3080 , 0),   // saturn 
      new Vector3(0, 770  , 0),   // uranus 
      new Vector3(0, 66.8 , 0),   // neptune
    ];

    const celestials: CelestialEntity[] = [];

    // Load all entities
    for (let i = 0; i < 9; ++i)
    {
      celestials.push(this.entities.get(names[i]) as CelestialEntity);
    }

    // Moon specific
    celestials[2].mesh.addChild(celestials[8].mesh);

    // Set each celestial transforms
    for (let i = 0; i < 9; ++i)
    {
      celestials[i].mesh.position = planetPositions[i];
      celestials[i].mesh.scaling.setAll(planetScales[i]);

      // celestials[i].SetupAnimations();
    }

    // Create lebals for each planet & start their animations ( we omit the moon ) 
    for (let i = 0; i < 8; ++i)
    {
      celestials[i].AddCollider(this.currentScene);

      const labelInfo = new UITextCreateInfo(celestials[i].name + "Info");
      labelInfo.fontSize        = 32;
      labelInfo.planeDimensions = new Vector2(10, 12);
      labelInfo.planePosition   = labelPositions[i];
      labelInfo.billboardmode   = BillboardMode.ALL;

      celestials[i].CreateLabel(this.planetInfo.planetsInfo1[i], this.currentScene);
    }
  }

  private async createRoof(): Promise<void>
  {
    var plane = MeshBuilder.CreatePlane
    (
      "roof", 
      {
        width: 10.0, 
        height: 10.0,
        updatable: true,
        sideOrientation: 2.0
      }, 
      this.currentScene.scene
    );

    plane.rotation = new Vector3(Math.PI / 2, 0, 0);

    const planeInfo = new EntityCreateInfo("roof");
    planeInfo.mesh = plane;

    this.entities.set("roof", new Entity(planeInfo));

    await this.entities.get('lab').mesh.scaling.setAll(10);
    await this.entities.get('lab').mesh.addChild(plane);
    plane.position = new Vector3(2.1, 7.6, -1.8);
    plane.scaling = new Vector3(1.85, 3, 0.1);

    const roofAnimation = new Animation('rotationAnima', 
    'rotation', 
    60,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT);

    const roofMove = new Animation('positionAnima',
    'position', 
    60,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT
    )

    const keyframes = [
        {frame: 0, value : new Vector3(Math.PI / 2, 0, 0)},
        {frame: 960, value : new Vector3(Math.PI / 2, 0, 2*Math.PI)}
    ]

    const keyposframes = [
        {frame: 0, value : plane.position},
        {frame: 960, value : plane.position.add(new Vector3(0, 150, 0))}
    ]

    roofAnimation.setKeys(keyframes);
    roofMove.setKeys(keyposframes);
    plane.animations = [];
    plane.animations.push(roofAnimation);
    plane.animations.push(roofMove);
  }

  private createWhiteboard(): void
  {
    const whiteboardInfo    = new UITextCreateInfo("Whiteboard");
    whiteboardInfo.fontSize         = 256;
    whiteboardInfo.planeDimensions  = new Vector2(64, 32);

    whiteboardInfo.text = "\nWelcome to the Solar System Explorer! \n\n" +
                          "Find the planets and put them on the platforms on the table in the correct order. Press the white button once you are done. \n\n" +
                          "Use the distance from the sun as a hint!";
    
    const whiteboard = new UIText(whiteboardInfo, this.currentScene.scene);
    whiteboard.textBlock.textVerticalAlignment  = Control.VERTICAL_ALIGNMENT_TOP;
    whiteboard.textBlock.alpha                  = 1.0;
    whiteboard.textBlock.paddingTop             = "20px";
    whiteboard.textBlock.paddingBottom          = "20px";
    whiteboard.textBlock.paddingLeft            = "20px";
    whiteboard.textBlock.paddingRight           = "20px";

    whiteboard.plane.position = new Vector3(-113.35, 47.5, 0);
    whiteboard.plane.rotation = new Vector3(0, -Math.PI / 2, 0);
  }

  private createButton(): void
  {
    const button = MeshBuilder.CreateCylinder("Button", {height:0.3, diameter:1}, this.currentScene.scene);
    button.position = new Vector3(-2.75, 18, -6.0);

    this.currentScene.scene.onPointerDown = (event, pickResult)=>
    {
      if (pickResult.hit && pickResult.pickedMesh && pickResult.pickedMesh.name === "Button")
      {
        var passChecks = true;
        for (const target of this.targets)
        {
          console.log(target.target + ": " + (target.match ? "Match" : "No Match"));
          if (target.match == false)
          {
            passChecks = false;
            break;
          }
        }

        console.log(passChecks ? "Pass!" : "Fail");
      }
    };
  }
};