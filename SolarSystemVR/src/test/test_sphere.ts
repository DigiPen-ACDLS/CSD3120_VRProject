
import * as BABYLON from "babylonjs";

export class TestSphere
{
  public name                 : string;
  public mesh                 : BABYLON.AbstractMesh;

  constructor(name: string, radius: number, scene: BABYLON.Scene)
  {
    this.name = name;

    // Create a sphere
    this.mesh = BABYLON.MeshBuilder.CreateSphere(name, {diameter: radius * 2, segments: 32}, scene);
    this.mesh.checkCollisions = true;

    const sixDOFDrag = new BABYLON.SixDofDragBehavior();
    this.mesh.addBehavior(sixDOFDrag);
  }
};