
import * as BABYLON from "babylonjs";

export class TestTrigger
{
  public targets              : Set<string>;
  public target               : string;
  public mesh                 : BABYLON.AbstractMesh;

  constructor(target: string, scene: BABYLON.Scene)
  {
    this.target = target;
    const meshName = target + "_trigger";

    // Create a sphere
    this.mesh = BABYLON.MeshBuilder.CreateSphere(meshName, {diameter: 0.5}, scene);
    this.mesh.checkCollisions = true;
    this.mesh.isVisible       = true;
    this.mesh.isPickable      = false;

    this.mesh.actionManager   = new BABYLON.ActionManager(scene);
  }

  public RegisterTargetIntersections(scene: BABYLON.Scene, potentialTargets: string[]): void
  {
    for (const potentialTarget in potentialTargets)
    {
      // Push target name into container on enter
      this.mesh.actionManager?.registerAction
      (
        new BABYLON.ExecuteCodeAction
        ( 
          {
            trigger   : BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter : scene.getMeshByName(potentialTarget)
          },
          () =>
          {
            this.targets.add(potentialTarget);
          }
        )
      );

      // Remove target name on exit
      this.mesh.actionManager?.registerAction
      (
        new BABYLON.ExecuteCodeAction
        ( 
          {
            trigger   : BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter : scene.getMeshByName(potentialTarget)
          },
          () =>
          {
            this.targets.delete(potentialTarget);
          }
        )
      );
    }
  }
};