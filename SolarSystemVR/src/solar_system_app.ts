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
  GizmoManager,
  HemisphericLight,
  MeshBuilder,
  PhotoDome,
  Scene,
  UniversalCamera,
  Vector2,
  Vector3 
} from "babylonjs";

import 'babylonjs-loaders';

import 
{ 
  animationPointerTree 
} from "babylonjs-loaders/glTF/2.0/Extensions/KHR_animation_pointer.data";

// Local Imports

import 
{ 
  AssetLoader 
} from "./app/assetloader";

import 
{ 
  WebXRApp, 
  XRMode, 
  XRScene 
} from "./app/";

import 
{ 
  CameraConfig, 
  CameraType, 
  Entity 
} from "./objects";
import { BillboardMode } from "./utilities/enums";
import { TextWrapper, TextWrapping } from "babylonjs-gui";

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
    await this.SetPlatformPositions();
    await this.SetPlanetPositions();
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
    const cameraConfig: CameraConfig = new CameraConfig(CameraType.Universal, "XRUserCamera", new Vector3(-8, 7, 0));
    this.currentScene.user.CreateCamera(cameraConfig);

    (this.currentScene.user.camera as UniversalCamera).minZ     = 0.01;
    (this.currentScene.user.camera as UniversalCamera).target   = new Vector3(-50, 0, 0);
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
      'assets/solarsystem/moon.glb',
      'assets/solarsystem/mars.glb',
      'assets/solarsystem/jupiter.glb',
      'assets/solarsystem/saturn.glb',
      'assets/solarsystem/uranus.glb',
      'assets/solarsystem/neptune.glb',
      'assets/models/the_design_lab.glb',
      'assets/models/sci_fi_platform.glb'
    ];
    
    const names = 
    [
      'mercury', 
      'venus',
      'earth',
      'moon',
      'mars',
      'jupiter',
      'saturn',
      'uranus',
      'neptune',
      'lab',
      'platform0'
    ];

    const promises      = await this.assetLoader.LoadMeshes(filepaths, names);
    const loadedMeshes  = await Promise.all(promises);

    loadedMeshes.forEach((mesh, i) => {
        const name = names[i];
        const entity = new Entity(name, mesh);
        this.entities.set(name, entity);
    });
  }

  private SetPlatformPositions(): void
  {
    this.entities.get('platform0').mesh.scaling.setAll(0.2);
    this.entities.get('platform0').mesh.position = new Vector3(-12.2, 17.5, -6.0);
    for(let i = 1; i < 8; ++i)
    {
      var plat = this.entities.get('platform0').mesh.clone('platform' + i.toString(), null);
      plat.scaling.setAll(0.2);
      plat.position = new Vector3(-12.2, 17.5, 6 * (i-1));

      this.entities.set('platform' + i.toString(), new Entity('platform' + i.toString(), plat));
    }

    for(let i = 0; i < 8; ++i)
    {
        this.entities.get('platform' + i.toString()).AddUITextPlane(
            "platform",{
                position: new Vector3(-20, 3, 0),
                rotation: new Vector3(Math.PI / 2, Math.PI / 2, 0),
                fontSize: 64
            },
            this.currentScene.scene
            );
    }
    this.entities.get('platform0').textLabel.textBlock.text = "Mercury";
    this.entities.get('platform1').textLabel.textBlock.text = "Venus";
    this.entities.get('platform2').textLabel.textBlock.text = "Earth";
    this.entities.get('platform3').textLabel.textBlock.text = "Mars";
    this.entities.get('platform4').textLabel.textBlock.text = "Jupiter";
    this.entities.get('platform5').textLabel.textBlock.text = "Saturn";
    this.entities.get('platform6').textLabel.textBlock.text = "Uranus";
    this.entities.get('platform7').textLabel.textBlock.text = "Neptune";
  }

  private SetPlanetPositions(): void
  {
    // Planets
    const mercury = this.entities.get('mercury');
    const venus   = this.entities.get('venus');
    const earth   = this.entities.get('earth');
    const moon    = this.entities.get('moon');
    const mars    = this.entities.get('mars');
    const jupiter = this.entities.get('jupiter');
    const saturn  = this.entities.get('saturn');
    const uranus  = this.entities.get('uranus');
    const neptune = this.entities.get('neptune');

    //Mercury
    mercury.mesh.position = new Vector3(-12.2, 19.5, -6.0);
    mercury.SetDraggable(true);
    mercury.mesh.scaling.setAll(1.2);
    
    //Animations
    this.StartPlanetAnimations(this.entities.get('mercury').mesh);

    //UI TextPlane Mercury
    mercury.AddUITextPlane("MercuryInformation",
    {
        position : new Vector3(0, 7, 0),
        planeDim : new Vector2(10, 12),
        billboard: BillboardMode.ALL,
    }, this.currentScene.scene);
    mercury.textLabel.textBlock.text = "FUN FACT MERCURY IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    mercury.textLabel.textBlock.textWrapping = true;

    //Venus
    venus.mesh.position = new Vector3(-12.2, 19.5, 0.0);
    venus.SetDraggable(true);
    venus.mesh.scaling.setAll(0.4);

    //Animations
    this.StartPlanetAnimations(this.entities.get('venus').mesh);

    //UI TextPlane Venus
    venus.AddUITextPlane("VenusInformation",
    {
        position : new Vector3(0, 21, 0),
        planeDim : new Vector2(10, 12),
        billboard: BillboardMode.ALL
    }, this.currentScene.scene);
    venus.textLabel.textBlock.text = "FUN FACT VENUS IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    venus.textLabel.textBlock.textWrapping = true;

    //Earth & Moon
    earth.mesh.position = new Vector3(-12.2, 19.5, 6.0);
    earth.mesh.scaling.setAll(0.001);
    earth.SetDraggable(true);
    earth.mesh.addChild(moon.mesh);
    moon.mesh.scaling.setAll(0.3);
    moon.mesh.position = new Vector3(700, 700, 0);

    //Animation
    this.StartPlanetAnimations(this.entities.get('earth').mesh);

    //UI TextPlane Earth & Moon
    earth.AddUITextPlane("EarthInformation",
    {
        position : new Vector3(0, 8400, 0),
        planeDim : new Vector2(10, 12),
        billboard: BillboardMode.ALL,
    }, this.currentScene.scene);
    earth.textLabel.textBlock.text = "FUN FACT EARTH IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    earth.textLabel.textBlock.textWrapping = true;

    //Mars
    mars.mesh.position = new Vector3(-12.2, 19.5, 12.0);
    mars.SetDraggable(true);
    mars.mesh.scaling.setAll(0.5);

    //Animations
    this.StartPlanetAnimations(mars.mesh);

    //UI TextPlane Mars
    mars.AddUITextPlane("MarsInformation",
    {
        position : new Vector3(0, 16.8, 0),
        planeDim : new Vector2(10, 12),
        billboard: BillboardMode.ALL,
    }, this.currentScene.scene);
    mars.textLabel.textBlock.text = "FUN FACT MARS IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    mars.textLabel.textBlock.textWrapping = true;

    //Jupiter
    jupiter.mesh.position = new Vector3(-12.2, 20.2, 18.0);
    jupiter.SetDraggable(true);
    jupiter.mesh.scaling.setAll(0.07);

    //Animations
    this.StartPlanetAnimations(jupiter.mesh);

    //UI TextPlane Jupiter
    jupiter.AddUITextPlane("JupiterInformation",
    {
        position : new Vector3(0, 110, 0),
        planeDim : new Vector2(10, 12),
        billboard: BillboardMode.ALL,
    }, this.currentScene.scene);
    jupiter.textLabel.textBlock.text = "FUN FACT JUPITER IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    jupiter.textLabel.textBlock.textWrapping = true;

    //Saturn
    saturn.mesh.position = new Vector3(-12.2, 20.2, 24.0);
    saturn.SetDraggable(true);
    saturn.mesh.scaling.setAll(0.0025);

    //Animations
    this.StartPlanetAnimations(saturn.mesh);

    //UI TextPlane Saturn
    saturn.AddUITextPlane("SaturnInformation",
    {
        position : new Vector3(0, 3080, 0),
        planeDim : new Vector2(10, 12),
        billboard: BillboardMode.ALL,
    }, this.currentScene.scene);
    saturn.textLabel.textBlock.text = "FUN FACT SATURN IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    saturn.textLabel.textBlock.textWrapping = true;

    //Uranus
    uranus.mesh.position = new Vector3(-12.2, 20.2, 30.0);
    uranus.SetDraggable(true);
    uranus.mesh.scaling.setAll(0.01);

    //Animations
    this.StartPlanetAnimations(uranus.mesh);

    //UI TextPlane Uranus
    uranus.AddUITextPlane("UranusInformation",
    {
        position : new Vector3(0, 770, 0),
        planeDim : new Vector2(10, 12),
        billboard: BillboardMode.ALL,
    }, this.currentScene.scene);
    uranus.textLabel.textBlock.text = "FUN FACT URANUS IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    uranus.textLabel.textBlock.textWrapping = true;

    //Neptune
    neptune.mesh.position = new Vector3(-12.2, 19.9, 36.0);
    neptune.SetDraggable(true);
    neptune.mesh.scaling.setAll(0.12);

    //Animations
    this.StartPlanetAnimations(neptune.mesh);

    //UI TextPlane Neptune
    neptune.AddUITextPlane("NeptuneInformation",
    {
        position : new Vector3(0, 66.8, 0),
        planeDim : new Vector2(10, 12),
        billboard: BillboardMode.ALL,
    }, this.currentScene.scene);
    neptune.textLabel.textBlock.text = "FUN FACT NEPTUNE IS SMALLER THAN YOUR MOM BECAUSE YO MAMA SO FAT THAT DORA CAN'T EVEN EXPLORE HER!"
    neptune.textLabel.textBlock.textWrapping = true;
  }

  private SetPlanetSpace(): void
  {

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
    this.entities.set("root", new Entity("roof", plane));

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
        {frame: 360, value : new Vector3(Math.PI / 2, 0, 2*Math.PI)}
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

  private StartPlanetAnimations(mesh : AbstractMesh) : void
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