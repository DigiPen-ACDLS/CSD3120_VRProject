
import * as BABYLON from "babylonjs";
import { WebXRApp, XRMode, XRScene } from "./app";
import { TestTrigger, TestSphere } from "./test";

export class SandboxVR extends WebXRApp
{
  private spheres : Map<string, TestSphere>;
  private triggers: Map<string, TestTrigger>;

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement)
  {
    // WebXRApp's ctor
    super(engine, canvas);

    this.spheres = new Map<string, TestSphere>();
    this.triggers = new Map<string, TestTrigger>();
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

    await this.createSpheres();
    await this.createFloor();
    // await this.createTriggers();

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
    this.currentScene.user.camera.position  = new BABYLON.Vector3(0, 2, -5);
    this.currentScene.user.camera.minZ      = 0.01;

    (this.currentScene.user.camera as BABYLON.FreeCamera).speed = 0.3;
    this.currentScene.user.camera.attachControl(this.canvas, true);

    this.currentScene.scene.activeCamera = this.currentScene.user.camera;
  }

  private createSpheres(): void
  {
    const sphereA = new TestSphere("A", 0.5, this.currentScene.scene);
    const sphereB = new TestSphere("B", 1.0, this.currentScene.scene);
    const sphereC = new TestSphere("C", 0.8, this.currentScene.scene);

    sphereA.mesh.position = new BABYLON.Vector3(-2,2,3);
    sphereB.mesh.position = new BABYLON.Vector3(0,1,2);
    sphereC.mesh.position = new BABYLON.Vector3(2,0,3);

    this.spheres.set("A", sphereA);
    this.spheres.set("B", sphereB);
    this.spheres.set("C", sphereC);
  }

  private createFloor(): void
  {
    const ground = BABYLON.MeshBuilder.CreateGround("Ground", {width:10, height:10}, this.currentScene.scene);
    ground.position = new BABYLON.Vector3(0,-1,0);
  }

  private createTriggers(): void
  {
    const triggerA = new TestTrigger("A", this.currentScene.scene);
    const triggerB = new TestTrigger("B", this.currentScene.scene);
    const triggerC = new TestTrigger("C", this.currentScene.scene);
    
    triggerA.mesh.position = new BABYLON.Vector3(-1,0,0);
    triggerB.mesh.position = new BABYLON.Vector3(0,0,0);
    triggerC.mesh.position = new BABYLON.Vector3(1,0,0);

    const potentialTargets: string[] = [ "A", "B", "C" ];
    triggerA.RegisterTargetIntersections(this.currentScene.scene,  potentialTargets);
    triggerB.RegisterTargetIntersections(this.currentScene.scene,  potentialTargets);
    triggerC.RegisterTargetIntersections(this.currentScene.scene,  potentialTargets);
  }
};