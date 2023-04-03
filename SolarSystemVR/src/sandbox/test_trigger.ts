
import * as BABYLON from "babylonjs";
import { TestSphere } from "./test_sphere";

export class TestTarget
{
  public target               : string;
  public mesh                 : BABYLON.AbstractMesh;
  public match                : boolean;

  constructor(target: TestSphere, scene: BABYLON.Scene)
  {
    this.target     = target.name;
    const meshName  = target.name + "_target";
    
    this.match          = false;

    // Create a sphere
    this.mesh = BABYLON.MeshBuilder.CreateSphere(meshName, {diameter: 0.2}, scene);
    this.mesh.checkCollisions = true;
    this.mesh.isVisible       = true;
    this.mesh.isPickable      = false;

    // Create material
    const triggerMaterial = new BABYLON.StandardMaterial(meshName + "_material", scene);
    triggerMaterial.diffuseColor = BABYLON.Color3.Red();

    this.mesh.material = triggerMaterial;
      
    scene.registerBeforeRender
    (
      ()=>
      {
        this.match = this.mesh.intersectsMesh(target.mesh, true);
        (this.mesh.material as BABYLON.StandardMaterial).diffuseColor = this.match ? BABYLON.Color3.Blue() : BABYLON.Color3.Red();
      }
    )
  }
};