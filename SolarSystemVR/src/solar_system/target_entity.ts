

// Packages
import
{
  AbstractMesh, 
  Color3, 
  MeshBuilder,
  StandardMaterial
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

    this.match    = false;
    this.target   = target.name;
    
    // Create material
    const triggerMaterial = new StandardMaterial(meshName + "_material", xrScene.scene);
    triggerMaterial.diffuseColor      = Color3.Red();
    triggerMaterial.alpha             = 0.2;

    this.mesh.material = triggerMaterial;
      
    xrScene.scene.registerBeforeRender
    (
      ()=>
      {
        this.match = this.mesh.intersectsMesh(target.sphereCollider, true);
        (this.mesh.material as StandardMaterial).diffuseColor = this.match ? Color3.Blue() : Color3.Red();
      }
    )
  }
};