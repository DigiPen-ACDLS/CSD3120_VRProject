
import * as BABYLON from "babylonjs";
import { TestSphere } from "./test_sphere";

export class TestTarget
{
  public target               : string;
  public mesh                 : BABYLON.AbstractMesh;
  public intersectObservable  : BABYLON.Observable<boolean>;
  public match                : boolean;

  private matchOutput : boolean;
  private mismatchOutput : boolean;

  constructor(target: TestSphere, targets: TestSphere[], scene: BABYLON.Scene)
  {
    this.target     = target.name;
    const meshName  = target.name + "_target";
    
    this.match          = false;
    this.matchOutput    = false;
    this.mismatchOutput = false;

    // Create a sphere
    this.mesh = BABYLON.MeshBuilder.CreateSphere(meshName, {diameter: 0.2}, scene);
    this.mesh.checkCollisions = true;
    this.mesh.isVisible       = true;
    this.mesh.isPickable      = false;

    this.intersectObservable = new BABYLON.Observable<boolean>();
    
    var currentTarget   : string = null;
    var potentialTarget : string = null;

    for (const t of targets)
    {
      scene.onBeforeRenderObservable.add
      (
        () =>
        {
          let IS_INTERSECTING = this.mesh.intersectsMesh(t.mesh, true, true);
          if (IS_INTERSECTING)
          {
            currentTarget     = target.name;
            potentialTarget   = t.name;
          }

          this.intersectObservable.notifyObservers(IS_INTERSECTING);
        }
      );
    }

    this.intersectObservable.add
    (
      async (intersecting)=>
      {
        this.match = (intersecting && currentTarget === potentialTarget);

        if (this.match && !this.matchOutput)
        {
          this.match          = true;
          this.mismatchOutput = false;

          console.log(currentTarget + " Matching " + potentialTarget);
        }
        
        if (!this.match && !this.mismatchOutput)
        {
          this.mismatchOutput = true;
          this.matchOutput    = false;
        }
      }
          
    );
  }
};