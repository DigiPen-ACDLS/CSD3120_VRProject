/**
  @fileoverview   Implementation for a base web XR application.
  @author         Diren D Bharwani, 2002216
*/

import * as BABYLON from "babylonjs"
import { Color3, CreateSphere, HemisphericLight, PhotoDome, Scene, SceneLoader, UniversalCamera, Vector3, Mesh, AbstractMesh, ThinRenderTargetTexture, Plane, Animation, Observable, AnimationGroup, GizmoManager, CubeMapToSphericalPolynomialTools } from "babylonjs";
import { XRMode, XRScene } from "./xr_scene";
import { AssetLoader } from "../assetloader";
import { Entity } from "../objects/entity";
import 'babylonjs-loaders';
import { animationPointerTree } from "babylonjs-loaders/glTF/2.0/Extensions/KHR_animation_pointer.data";

/**
 * Base class for a WebXRApp. The scene needs to be initialised before being used.
 * The engine and canvas must be created outside the application.
 */
export class WebXRApp
{
  //===========================================================================
  // Data Members
  //===========================================================================

  protected engine        : BABYLON.Engine;
  protected canvas        : HTMLCanvasElement;

  protected currentScene  : XRScene;
  protected scenes        : Map<string, XRScene>;
  
  protected assetLoader   : AssetLoader;
  protected entities      : Map<string, Entity>;

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement)
  {
    this.engine = engine;
    this.canvas = canvas;
  }

  //===========================================================================
  // Member Functions
  //===========================================================================

  public async Init(): Promise<void>
  {
    await this.currentScene.InitXR(true);

    //Assets
    this.assetLoader = new AssetLoader(this.currentScene.scene);

    //Enable Gizmo
    const gizmoManager = new GizmoManager(this.currentScene.scene);
    gizmoManager.positionGizmoEnabled = true;

    //Entities
    this.entities = new Map<string, Entity>();

    //===========================================================================
    // Camera Creation
    //===========================================================================
    const camera = new UniversalCamera('uniCamera', new Vector3(-8, 7, 0), this.currentScene.scene);
    camera.target = new Vector3(-50, 0, 0);
    camera.attachControl(this.canvas, true);
    this.currentScene.scene.activeCamera = camera;

    //===========================================================================
    // Light Creation
    //===========================================================================
    const hemiLight = new HemisphericLight('hemLight', new Vector3(-1, 1, 0), this.currentScene.scene);
    hemiLight.intensity = 1.0;
    hemiLight.diffuse = new Color3(1, 1, 1);

    //===========================================================================
    // Photodome Creation
    //===========================================================================
    var photodome =  new BABYLON.PhotoDome("space_dome", "assets/textures/Skybox/space_skydome.jpg",
        {
            resolution : 32,
            size: 1000,
            useDirectMapping : false
        },
    this.currentScene.scene);


    //===========================================================================
    // Loade All Assets
    //===========================================================================
    const filepaths = [
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
        'assets/models/sci_fi_platform.glb'];
    
    const names = [
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
        'platform'];
    
    const promises = await this.assetLoader.LoadMeshes(filepaths, names);
    const loadedMeshes = await Promise.all(promises);

    loadedMeshes.forEach((mesh, i) => {
        const name = names[i];
        const entity = new Entity(name, mesh, false);
        this.entities.set(name, entity);
    });

    for(let i = 1; i < 8; ++i)
    {
       var plat = this.entities.get('platform').mesh.clone('platform' + i.toString(), null);
       plat.scaling.setAll(0.2);
       this.entities.set('platform' + i.toString(), new Entity('platform' + i.toString(), plat, false));
    }


    var plane = BABYLON.MeshBuilder.CreatePlane("roof", {
        width: 10.0, 
        height: 10.0,
        updatable: true,
        sideOrientation: 2.0
    }, this.currentScene.scene);
    plane.rotation = new Vector3(Math.PI / 2, 0, 0);
    this.entities.set("root", new Entity("roof", plane, false));

    await this.entities.get('lab').mesh.scaling.setAll(10);
    await this.entities.get('lab').mesh.addChild(plane);
    plane.position = new Vector3(2.1, 7.6, -1.8);
    plane.scaling = new Vector3(1.85, 3, 0.1);

    //Roof animation
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

    //===========================================================================
    // Planets
    //===========================================================================

    this.entities.get('platform').mesh.scaling.setAll(0.2);
    this.entities.get('platform').mesh.position = new Vector3(-12.2, 17.5, -6.0);
    this.entities.get('platform1').mesh.position = new Vector3(-12.2, 17.5, 0.0);
    this.entities.get('platform2').mesh.position = new Vector3(-12.2, 17.5, 6.0);
    this.entities.get('platform3').mesh.position = new Vector3(-12.2, 17.5, 12.0);
    this.entities.get('platform4').mesh.position = new Vector3(-12.2, 17.5, 18.0);
    this.entities.get('platform5').mesh.position = new Vector3(-12.2, 17.5, 24.0);
    this.entities.get('platform6').mesh.position = new Vector3(-12.2, 17.5, 30.0);
    this.entities.get('platform7').mesh.position = new Vector3(-12.2, 17.5, 36.0);
    this.entities.get('earth').mesh.scaling.setAll(0.001);
    
}

  public Update(): void
  {
    this.engine.runRenderLoop(() => {
      this.currentScene.scene.render();
    });
  }

  public Exit(): void
  {

  }
}