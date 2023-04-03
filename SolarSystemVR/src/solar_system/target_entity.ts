

// Packages
import
{
  AbstractMesh, 
  Color3, 
  Mesh, 
  MeshBuilder,
  StandardMaterial,
  Vector3
} from "babylonjs";


// Local Imports
import 
{ 
  XRScene 
} from "../app";

import 
{ 
  Entity, 
  EntityCreateInfo 
} from "../objects";

import 
{
  CelestialEntity
} from "../solar_system";

export class TargetEntity extends Entity
{
  public target               : string;
  public match                : boolean;
  public firstMatch           : boolean;

  constructor(target: CelestialEntity, xrScene: XRScene)
  {
    const meshName  = target.name + "_target";

    const sphere = MeshBuilder.CreateSphere(meshName, {diameter: 1}, xrScene.scene);
    sphere.checkCollisions  = true;
    sphere.isVisible        = true;
    sphere.isPickable       = false;

    const entityCreateInfo = new EntityCreateInfo(meshName);
    entityCreateInfo.mesh = sphere;

    super(entityCreateInfo);

    this.match      = false;
    this.firstMatch = false;
    this.target     = target.name;
    
    // Create material
    const triggerMaterial         = new StandardMaterial(meshName + "_material", xrScene.scene);
    triggerMaterial.diffuseColor  = Color3.Red();
    triggerMaterial.alpha         = 0.2;

    this.mesh.material = triggerMaterial;
      
    xrScene.scene.registerBeforeRender
    (
      ()=>
      {
        this.match = this.mesh.intersectsMesh(target.sphereCollider, true);

        if (this.match)
        { 
          if (!this.firstMatch)
          {
            (target.mesh as Mesh).position = new Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);

            target.StartAnimations(xrScene);
            this.firstMatch = true;
          }

          (this.mesh.material as StandardMaterial).diffuseColor = Color3.Green();
        }
        else
        {
          (this.mesh.material as StandardMaterial).diffuseColor = Color3.Red();
        }
      }
    )
  }
};