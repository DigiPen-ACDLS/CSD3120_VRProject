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
  UITextCreateInfo
} from "../objects";

import 
{
  CelestialEntity,
  CoasterEntity
} from "../solar_system";

import 
{ 
  BillboardMode 
} from "../utilities";

import { TextWrapper, TextWrapping } from "babylonjs-gui";
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

  private assetLoader   : AssetLoader;
  private entities      : Map<string, Entity>;

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(engine: Engine, canvas: HTMLCanvasElement)
  {
    // WebXRApp's ctor
    super(engine, canvas);

    this.entities = new Map<string, Entity>();
  }

  //===========================================================================
  // Public Member Functions
  //===========================================================================

  public async Init(): Promise<void>
  {
    this.currentScene = new XRScene(XRMode.VR, this.engine);

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
    await this.CreateRoof();
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
    this.currentScene.CreateDefaultUser(new Vector3(-50, 0, 0));
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
      'mercury',  // 0
      'venus',    // 1
      'earth',    // 2
      'mars',     // 3
      'jupiter',  // 4
      'saturn',   // 5
      'uranus',   // 6
      'neptune',  // 7
      'moon',     // 8
      'lab',      // 9
      'platform0' // 10
    ];

    const promises      = await this.assetLoader.LoadMeshes(filepaths, names);
    const loadedMeshes  = await Promise.all(promises);

    // 9 celestial entities (8 planets + 1 moon)
    for (let i = 0; i < 9; ++i)
    {
      const celestialInfo = new EntityCreateInfo(names[i]);
      celestialInfo.mesh = loadedMeshes[i];

      this.entities.set(names[i], new CelestialEntity(celestialInfo, this.currentScene));
      (this.entities.get(names[i]) as CelestialEntity).SetDraggable(true);
    }

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
      "Neptune"
    ];

    for(let i = 0; i < 8; ++i)
    {
      const platform = this.entities.get('platform' + i.toString());

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
      'mercury',  // 0
      'venus',    // 1
      'earth',    // 2
      'mars',     // 3
      'jupiter',  // 4
      'saturn',   // 5
      'uranus',   // 6
      'neptune',  // 7
      'moon',     // 8
    ];

    let planetPositions = [
      new Vector3(-12.2, 19.5, -6.0 ),    // mercury
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
    celestials[8].SetDraggable(false);
    celestials[2].mesh.addChild(celestials[8].mesh);

    // Set each celestial transforms
    for (let i = 0; i < 9; ++i)
    {
      celestials[i].mesh.position = planetPositions[i];
      celestials[i].mesh.scaling.setAll(planetScales[i]);
    }

    // Create lebals for each planet & start their animations ( we omit the moon ) 
    for (let i = 0; i < 8; ++i)
    {
      const labelInfo = new UITextCreateInfo(celestials[i].name + "Info");
      labelInfo.fontSize        = 32;
      labelInfo.planeDimensions = new Vector2(10, 12);
      labelInfo.planePosition   = labelPositions[i];
      labelInfo.billboardmode   = BillboardMode.ALL;

      celestials[i].CreateLabel(labelInfo, this.currentScene);
      this.startPlanetAnimations(celestials[i].mesh);
    }

    // //UI TextPlane Mercury
    // mercury.AddUITextPlane("MercuryInformation",
    // {
    //     position : ,
    //     planeDim : new Vector2(10, 12),
    //     billboard: BillboardMode.ALL,
    // }, this.currentScene.scene);
    // mercury.textLabel.textBlock.text = "FUN FACT MERCURY IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    // mercury.textLabel.textBlock.textWrapping = true;

    // //Venus
    // venus.mesh.position = ;
    // venus.mesh.scaling.setAll(0.4);

    // //Animations
    // this.startPlanetAnimations(this.entities.get('venus').mesh);

    // //UI TextPlane Venus
    // venus.AddUITextPlane("VenusInformation",
    // {
    //     position : ,
    //     planeDim : new Vector2(10, 12),
    //     billboard: BillboardMode.ALL
    // }, this.currentScene.scene);
    // venus.textLabel.textBlock.text = "FUN FACT VENUS IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    // venus.textLabel.textBlock.textWrapping = true;

    // //Earth & Moon
    // earth.mesh.position = ;
    // earth.mesh.scaling.setAll(0.001);
    // earth.mesh.addChild(moon.mesh);
    // moon.mesh.scaling.setAll(0.3);
    // moon.mesh.position = ;

    // //Animation
    // this.startPlanetAnimations(this.entities.get('earth').mesh);

    // //UI TextPlane Earth & Moon
    // earth.AddUITextPlane("EarthInformation",
    // {
    //     position : ,
    //     planeDim : new Vector2(10, 12),
    //     billboard: BillboardMode.ALL,
    // }, this.currentScene.scene);
    // earth.textLabel.textBlock.text = "FUN FACT EARTH IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    // earth.textLabel.textBlock.textWrapping = true;

    // //Mars
    // mars.mesh.position = ;
    // mars.mesh.scaling.setAll(0.5);

    // //Animations
    // this.startPlanetAnimations(mars.mesh);

    // //UI TextPlane Mars
    // mars.AddUITextPlane("MarsInformation",
    // {
    //     position : ,
    //     planeDim : new Vector2(10, 12),
    //     billboard: BillboardMode.ALL,
    // }, this.currentScene.scene);
    // mars.textLabel.textBlock.text = "FUN FACT MARS IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    // mars.textLabel.textBlock.textWrapping = true;

    // //Jupiter
    // jupiter.mesh.position = ;
    // jupiter.mesh.scaling.setAll(0.07);

    // //Animations
    // this.startPlanetAnimations(jupiter.mesh);

    // //UI TextPlane Jupiter
    // jupiter.AddUITextPlane("JupiterInformation",
    // {
    //     position : ,
    //     planeDim : new Vector2(10, 12),
    //     billboard: BillboardMode.ALL,
    // }, this.currentScene.scene);
    // jupiter.textLabel.textBlock.text = "FUN FACT JUPITER IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    // jupiter.textLabel.textBlock.textWrapping = true;

    // //Saturn
    // saturn.mesh.position =;
    // saturn.mesh.scaling.setAll(0.0025);

    // //Animations
    // this.startPlanetAnimations(saturn.mesh);

    // //UI TextPlane Saturn
    // saturn.AddUITextPlane("SaturnInformation",
    // {
    //     position : ,
    //     planeDim : new Vector2(10, 12),
    //     billboard: BillboardMode.ALL,
    // }, this.currentScene.scene);
    // saturn.textLabel.textBlock.text = "FUN FACT SATURN IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    // saturn.textLabel.textBlock.textWrapping = true;

    // //Uranus
    // uranus.mesh.position = ;
    // uranus.mesh.scaling.setAll(0.01);

    // //Animations
    // this.startPlanetAnimations(uranus.mesh);

    // //UI TextPlane Uranus
    // uranus.AddUITextPlane("UranusInformation",
    // {
    //     position : ,
    //     planeDim : new Vector2(10, 12),
    //     billboard: BillboardMode.ALL,
    // }, this.currentScene.scene);
    // uranus.textLabel.textBlock.text = "FUN FACT URANUS IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    // uranus.textLabel.textBlock.textWrapping = true;

    // //Neptune
    // neptune.mesh.position = ;
    // neptune.SetDraggable(true);
    // neptune.mesh.scaling.setAll(0.12);

    // //Animations
    // this.startPlanetAnimations(neptune.mesh);

    // //UI TextPlane Neptune
    // neptune.AddUITextPlane("NeptuneInformation",
    // {
    //     position : ,
    //     planeDim : new Vector2(10, 12),
    //     billboard: BillboardMode.ALL,
    // }, this.currentScene.scene);
    // neptune.textLabel.textBlock.text = "FUN FACT NEPTUNE IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    // neptune.textLabel.textBlock.textWrapping = true;
  }

  private AnimateToSpace(mesh : AbstractMesh, position : Vector3, scale : number)
  {
    const planetScaling = new Animation("scalingAnimation", 
    "scaling",
    60,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const planetMove = new Animation("positionAnimation", 
    "position",
    60,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const keyframes = [
      {frame: 0, value : mesh.scaling},
      {frame: 360, value : mesh.scaling.multiply(new Vector3(scale, scale, scale))}
    ]

    const posKeyFrames = [
      {frame: 0, value : mesh.position},
      {frame: 360, value : position}
    ]

    planetScaling.setKeys(keyframes);
    planetMove.setKeys(posKeyFrames);
    mesh.animations = [];
    mesh.animations.push(planetScaling);
    mesh.animations.push(planetMove);

    this.currentScene.scene.beginAnimation(mesh, 0, 360, false);
  }

  private async CreateRoof(): Promise<void>
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

  private startPlanetAnimations(mesh : AbstractMesh) : void
  {
    const planetRotAnimation = new Animation('rotationAnima', 
    'rotation', 
    60,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CYCLE);

    const planetFloatAnimation = new Animation('positionAnima',
    'position',
    60,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CYCLE
    )

    const keyframes = [
        {frame: 0, value : mesh.rotation},
        {frame: 120, value : mesh.rotation.add(new Vector3(0, Math.PI * 2, 0))}
    ]

    const keyposframes = [
        {frame: 0, value : mesh.position},
        {frame: 60, value : mesh.position.add(new Vector3(0, 0.2, 0))},
        {frame: 120, value : mesh.position}
    ]

    planetRotAnimation.setKeys(keyframes);
    planetFloatAnimation.setKeys(keyposframes);
    mesh.animations = [];
    mesh.animations.push(planetRotAnimation);
    mesh.animations.push(planetFloatAnimation);

    this.currentScene.scene.beginAnimation(mesh, 0, 120, true);
  }
};