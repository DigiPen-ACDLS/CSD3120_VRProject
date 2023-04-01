
import * as BABYLON from "babylonjs";
import "regenerator-runtime";
import Ammo from "ammojs-typed";

import { WebXRApp, XRMode, XRScene } from "./app";
import { TestTarget, TestSphere } from "./test";

export class SandboxVR extends WebXRApp
{
  private triggers: Map<string, TestTarget>;

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(engine: BABYLON.Engine, canvas: HTMLCanvasElement)
  {
    // WebXRApp's ctor
    super(engine, canvas);

    this.triggers = new Map<string, TestTarget>();
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
    await this.verify();
    

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

  private createFloor(): void
  {
    const ground = BABYLON.MeshBuilder.CreateGround("Ground", {width:10, height:10}, this.currentScene.scene);
    ground.position = new BABYLON.Vector3(0,0,0);
  }

  private createSpheresAndTargets(): void
  {
    var spheres: TestSphere[] = [
      new TestSphere("A", 0.5, this.currentScene.scene),
      new TestSphere("B", 1.0, this.currentScene.scene),
      new TestSphere("C", 0.8, this.currentScene.scene)
    ]

    // A
    spheres[0].mesh.position = new BABYLON.Vector3(0,1,0);
    const triggerA = new TestTarget(spheres[0], spheres, this.currentScene.scene);
    triggerA.mesh.position = new BABYLON.Vector3(0,0.5,-2);
    this.triggers.set("TargetA", triggerA);

    // B
    spheres[1].mesh.position = new BABYLON.Vector3(-1,1,0);
    const triggerB = new TestTarget(spheres[1], spheres, this.currentScene.scene);
    triggerB.mesh.position = new BABYLON.Vector3(1,0.5,-2);
    this.triggers.set("TargetB", triggerB);


    // C
    spheres[2].mesh.position = new BABYLON.Vector3(1,1,0);
    const triggerC = new TestTarget(spheres[2], spheres, this.currentScene.scene);
    triggerC.mesh.position = new BABYLON.Vector3(-1,0.5,-2);
    this.triggers.set("TargetC", triggerC);

  }

  private verify(): void
  {
    this.currentScene.scene.onKeyboardObservable.add
    (
      (keyboardInfo)=>
      {
        var passChecks = true;

        switch(keyboardInfo.type)
        {
          case BABYLON.KeyboardEventTypes.KEYDOWN:
          {
            switch (keyboardInfo.event.key)
            {
              case "r":
              case "R":
              {
                for (const [name, trigger] of this.triggers)
                {
                  if (trigger.match)
                  {
                    passChecks  = false;
                    break;
                  }
                }

                if (passChecks)
                  console.log("Pass!");
                else
                  console.log("Fail!");

                break;
              }
            }
            
            break;
          }
        }
      }
    );

    
  }
};