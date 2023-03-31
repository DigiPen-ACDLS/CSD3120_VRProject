import { AbstractMesh, Material, PointerDragBehavior, Texture, Vector3 } from "babylonjs";

export class Entity
{
    public name      : string
    public mesh      : AbstractMesh
    public texture   : Texture
    public material  : Material 
    //Might need text plane

    constructor(objectname : string, objectmesh : AbstractMesh, isPickable : Boolean){
        this.name = objectname;
        this.mesh = objectmesh;

        if(isPickable)
        {
            const pointerDragBehavior = new PointerDragBehavior();
            objectmesh.addBehavior(pointerDragBehavior);
            pointerDragBehavior.onDragObservable.add((eventData)=>{
            });
        }

    }

}