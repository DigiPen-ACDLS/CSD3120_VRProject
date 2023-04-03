/**
  @fileoverview   Sandbox Applicaiton for testing behaviour because babylon is so weird and imo
                  a poor excuse for a full flegded engine. Should've used Unity.
  @author         Diren D Bharwani, 2002216
*/

// Packages
import 
{ 
  Engine, 
  FreeCamera, 
  HemisphericLight, 
  MeshBuilder,
  Scene,
  UniversalCamera, 
  Vector3, 
  WebXRCamera 
} from "babylonjs";

// Local Imports
import 
{
   WebXRApp, 
   XRMode, 
   XRScene 
} from "../app";

import 
{ 
  TestTarget, 
  TestSphere 
} from "../sandbox";

export class SandboxVR extends WebXRApp
{
  private spheres: TestSphere[];
  private triggers: TestTarget[];

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(engine: Engine, canvas: HTMLCanvasElement)
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

    var light = new HemisphericLight("Light", new Vector3(0, 1, 0), this.currentScene.scene);
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
    const camera = new FreeCamera("Camera", new Vector3(0, 3, -5), this.currentScene.scene);
    camera.minZ  = 0.01;
    camera.speed = 0.3;
  
    camera.attachControl(this.canvas);

    // const xrCamera        = new WebXRCamera("XRCamera", this.currentScene.scene, this.currentScene.sessionManager);
    // xrCamera.setTransformationFromNonVRCamera(universalCamera);
    // xrCamera.attachControl(this.canvas, true);

    this.currentScene.scene.activeCamera  = camera;
    this.currentScene.user.camera         = camera;
  }

  private createFloor(): void
  {
    const ground = MeshBuilder.CreateGround("Ground", {width:10, height:10}, this.currentScene.scene);
    ground.position = new Vector3(0,0,0);
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
    this.spheres[0].mesh.position   = new Vector3(0,1,0);
    this.triggers[0].mesh.position  = new Vector3(0,0.5,-2);

    // B
    this.spheres[1].mesh.position   = new Vector3(-1,1,0);
    this.triggers[1].mesh.position  = new Vector3(1,0.5,-2);

    // C
    this.spheres[2].mesh.position = new Vector3(1,1,0);
    this.triggers[2].mesh.position = new Vector3(-1,0.5,-2);
  }

  private createButton(): void
  {
    const button = MeshBuilder.CreateCylinder("Button", {height:0.3, diameter:1}, this.currentScene.scene);
    button.position = new Vector3(0,0.3,-4);

    this.currentScene.scene.onPointerDown = (event, pickResult)=>
    {
      if (pickResult.hit && pickResult.pickedMesh && pickResult.pickedMesh.name === "Button")
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