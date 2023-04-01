
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

    // Add drag behaviour
    const verticalDrag    = new BABYLON.PointerDragBehavior( { dragAxis: new BABYLON.Vector3(0,1,0) });
    const horizontalDrag  = new BABYLON.PointerDragBehavior( { dragPlaneNormal: new BABYLON.Vector3(0,1,0) });

    verticalDrag.onDragStartObservable.add
    (
      (event)=>
      {
        if (event.dragPlanePoint.y < this.mesh.position.y)
        {
          const dragID = verticalDrag.currentDraggingPointerId;
          verticalDrag.detach();
          horizontalDrag.attach(this.mesh);
          horizontalDrag.startDrag(dragID);
        }
      }
    );

    horizontalDrag.onDragEndObservable.add
    (
      ()=>
      {
        horizontalDrag.detach();
        verticalDrag.attach(this.mesh);
      }
    );

    this.mesh.addBehavior(verticalDrag);
  }
};