/**
  @fileoverview   Implementation of the solar system WebXR application.
  @author         Diren D Bharwani, 2002216
                  <fill in your name Leonard>
*/

// Packages
import 
{ 
  Animation,
  Color3,
  Engine, 
  GizmoManager,
  HemisphericLight,
  MeshBuilder,
  PhotoDome,
  Scene,
  UniversalCamera,
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
} from "../app/assetloader";

import 
{ 
  WebXRApp, 
  XRMode, 
  XRScene 
} from "../app";

import 
{ 
  Entity, 
  EntityCreateInfo 
} from "../objects";

import 
{
  CelestialEntity
} from "./celestial_entity";

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
    this.currentScene.CreateDefaultUser(new Vector3(-8, 7, 0));

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
      'mercury',    // 0
      'venus',      // 1
      'earth',      // 2
      'moon',       // 3
      'mars',       // 4
      'jupiter',    // 5
      'saturn',     // 6
      'uranus',     // 7
      'neptune',    // 8
      'lab',        // 9
      'platform0'   // 10
    ];

    const promises      = await this.assetLoader.LoadMeshes(filepaths, names);
    const loadedMeshes  = await Promise.all(promises);

    // 9 beacuse the moon (8 planets + 1 moon)
    for (let i = 0; i < 9; ++i)
    {
      const entityInfo = new EntityCreateInfo(names[i]);
      entityInfo.mesh = loadedMeshes[i];

      this.entities.set(names[i], new CelestialEntity(entityInfo, this.currentScene));
    }

    // Lab
    const labCreateInfo = new EntityCreateInfo(names[9]);
    labCreateInfo.mesh = loadedMeshes[9];
    this.entities.set(names[9], new Entity(labCreateInfo));

    // Platform 0
    const p0CreateInfo = new EntityCreateInfo(names[10]);
    p0CreateInfo.mesh = loadedMeshes[10];
    this.entities.set(names[10], new Entity(p0CreateInfo));
  }

  private SetPlatformPositions(): void
  {
    this.entities.get('platform').mesh.scaling.setAll(0.2);
    this.entities.get('platform').mesh.position = new Vector3(-12.2, 17.5, -6.0);
    for(let i = 0; i < 7; ++i)
    {
      var plat = this.entities.get('platform').mesh.clone('platform' + i.toString(), null);
      plat.scaling.setAll(0.2);
      plat.position = new Vector3(-12.2, 17.5, 6 * i);

      this.entities.set('platform' + i.toString(), new Entity('platform' + i.toString(), plat));
    }
  }

  private SetPlanetPositions(): void
  {
    // Planets
    this.entities.get('mercury').mesh.position = new Vector3(-12.2, 19.5, -6.0);
    this.entities.get('mercury').SetDraggable(true);
    this.entities.get('mercury').mesh.scaling.setAll(1.2);

    this.entities.get('venus').mesh.position = new Vector3(-12.2, 19.5, 0.0);
    this.entities.get('venus').SetDraggable(true);
    this.entities.get('venus').mesh.scaling.setAll(0.4);

    this.entities.get('earth').mesh.position = new Vector3(-12.2, 19.5, 6.0);
    this.entities.get('earth').mesh.scaling.setAll(0.001);
    this.entities.get('earth').SetDraggable(true);
    this.entities.get('earth').mesh.addChild(this.entities.get('moon').mesh);
    this.entities.get('moon').mesh.scaling.setAll(0.3);
    this.entities.get('moon').mesh.position = new Vector3(700, 700, 0);

    this.entities.get('mars').mesh.position = new Vector3(-12.2, 19.5, 12.0);
    this.entities.get('mars').SetDraggable(true);
    this.entities.get('mars').mesh.scaling.setAll(0.5);

    this.entities.get('jupiter').mesh.position = new Vector3(-12.2, 20.2, 18.0);
    this.entities.get('jupiter').SetDraggable(true);
    this.entities.get('jupiter').mesh.scaling.setAll(0.07);

    this.entities.get('saturn').mesh.position = new Vector3(-12.2, 20.2, 24.0);
    this.entities.get('saturn').SetDraggable(true);
    this.entities.get('saturn').mesh.scaling.setAll(0.0025);

    this.entities.get('uranus').mesh.position = new Vector3(-12.2, 19.9, 30.0);
    this.entities.get('uranus').SetDraggable(true);
    this.entities.get('uranus').mesh.scaling.setAll(0.00002);

    this.entities.get('neptune').mesh.position = new Vector3(-12.2, 19.9, 36.0);
    this.entities.get('neptune').SetDraggable(true);
    this.entities.get('neptune').mesh.scaling.setAll(0.12);
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
};