/**
  @fileoverview   Implementation for a base web XR application.
  @author         Diren D Bharwani, 2002216
*/

import * as BABYLON from "babylonjs"
import { Color3, CreateSphere, HemisphericLight, PhotoDome, Scene, SceneLoader, UniversalCamera, Vector3, Mesh, AbstractMesh, ThinRenderTargetTexture, Plane, Animation, Observable, AnimationGroup } from "babylonjs";
import { XRMode, XRScene } from "./xr_scene";
import { AssetLoader } from "../assetloader";
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

  public async Init()
  {
    await this.currentScene.InitXR(true);
    this.assetLoader = new AssetLoader(this.currentScene.scene);

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
    // Background
    //===========================================================================
    var plane = BABYLON.MeshBuilder.CreatePlane("roof", {
        width: 10.0, 
        height: 10.0,
        updatable: true,
        sideOrientation: 2.0
    }, this.currentScene.scene);
    plane.rotation = new Vector3(Math.PI / 2, 0, 0);

    
    var mesh = this.assetLoader.LoadMesh('assets/models/the_design_lab.glb', 'designlab');
    (await mesh).scaling.setAll(10);
    (await mesh).addChild(plane);
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

    window.addEventListener('keydown', e => {
        if (e.key === 'f')
        {
            this.currentScene.scene.beginAnimation(plane, 0, 540, true);
        }
    });


    //===========================================================================
    // Planets
    //===========================================================================
}

  public Update()
  {
    this.engine.runRenderLoop(() => {
      this.currentScene.scene.render();
    });
  }

  public Exit()
  {

  }
}