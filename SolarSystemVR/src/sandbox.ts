
import * as BABYLON from "babylonjs";

import { WebXRApp, XRMode, XRScene } from "./app";
import { TestTarget, TestSphere } from "./test";
import { CameraConfig, CameraType } from "./objects";
import { UniversalCamera, Vector3, WebXRCamera } from "babylonjs";

export class SandboxVR extends WebXRApp
{
  private spheres: TestSphere[];
  private triggers: TestTarget[];

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement)
  {
    // WebXRApp's ctor
    super(engine, canvas);

    this.spheres = [];
    this.triggers = [];
  }

  //===========================================================================
  // Public Member Functions
  //===========================================================================

  public async Init(): Promise<void>
  {
    this.currentScene = new XRScene(XRMode.VR, this.engine);
    await super.Init();

    this.initUser();

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.currentScene.scene);
    light.intensity = 0.7;

    await this.createFloor();
    await this.createSpheresAndTargets();
    await this.createButton();
    
    
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
    const universalCamera = new UniversalCamera("Camera", new Vector3(0, 3, -5), this.currentScene.scene);
    universalCamera.minZ  = 0.01;
    universalCamera.speed = 0.3;
  
    universalCamera.attachControl(this.canvas, true);

    const xrCamera        = new WebXRCamera("XRCamera", this.currentScene.scene, this.currentScene.sessionManager);
    xrCamera.setTransformationFromNonVRCamera(universalCamera);
    xrCamera.attachControl(this.canvas, true);

    this.currentScene.scene.activeCamera  = xrCamera;
    this.currentScene.user.camera         = xrCamera;
  }

  private createFloor(): void
  {
    const ground = BABYLON.MeshBuilder.CreateGround("Ground", {width:10, height:10}, this.currentScene.scene);
    ground.position = new BABYLON.Vector3(0,0,0);
  }

  private createSpheresAndTargets(): void
  {
    // Spheres
    this.spheres.push(new TestSphere("A", 0.5, this.currentScene.scene));
    this.spheres.push(new TestSphere("B", 0.7, this.currentScene.scene));
    this.spheres.push(new TestSphere("C", 0.6, this.currentScene.scene));

    // Triggers
    this.triggers.push(new TestTarget(this.spheres[0], this.currentScene.scene));
    this.triggers.push(new TestTarget(this.spheres[1], this.currentScene.scene));
    this.triggers.push(new TestTarget(this.spheres[2], this.currentScene.scene));
  
    // A
    this.spheres[0].mesh.position   = new BABYLON.Vector3(0,1,0);
    this.triggers[0].mesh.position  = new BABYLON.Vector3(0,0.5,-2);

    // B
    this.spheres[1].mesh.position   = new BABYLON.Vector3(-1,1,0);
    this.triggers[1].mesh.position  = new BABYLON.Vector3(1,0.5,-2);

    // C
    this.spheres[2].mesh.position = new BABYLON.Vector3(1,1,0);
    this.triggers[2].mesh.position = new BABYLON.Vector3(-1,0.5,-2);
  }

  private createButton(): void
  {
    const button = BABYLON.MeshBuilder.CreateCylinder("Button", {height:0.3, diameter:1}, this.currentScene.scene);
    button.position = new BABYLON.Vector3(0,0.3,-4);

    this.currentScene.scene.onPointerDown = (event, pickResult)=>
    {
      if (pickResult.hit && pickResult.pickedMesh.name === "Button")
      {
        var passChecks = true;
        for (const trigger of this.triggers)
        {
          console.log(trigger.target + ": " + (trigger.match ? "Match" : "No Match"));
          if (trigger.match == false)
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