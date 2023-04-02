
import * as BABYLON from "babylonjs";

import { WebXRApp, XRMode, XRScene } from "./app";
import { TestTarget, TestSphere } from "./test";
import { CameraConfig, CameraType } from "./objects";
import { UniversalCamera, Vector3 } from "babylonjs";

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

    this.initUser();

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.currentScene.scene);
    light.intensity = 0.7;

    await this.createFloor();
    await this.createSpheresAndTargets();
    await this.createButton();
    
    await super.Init();
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
    const cameraConfig: CameraConfig = new CameraConfig(CameraType.Universal, "XRUserCamera", new Vector3(0, 2, -10));
    this.currentScene.user.CreateCamera(cameraConfig);

    this.currentScene.user.camera.minZ      = 0.01;

    (this.currentScene.user.camera as UniversalCamera).speed = 0.3;
    this.currentScene.user.camera.attachControl(this.canvas, true);

    this.currentScene.scene.activeCamera = this.currentScene.user.camera;
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