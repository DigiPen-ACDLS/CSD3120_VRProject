import { AbstractMesh, Material, PointerDragBehavior, Texture, Vector3 } from "babylonjs";
import { UIText, UITextCreateInfo } from "../objects/uiText";

export class Entity
{
    public name      : string
    public mesh      : AbstractMesh
    public texture   : Texture
    public material  : Material 
    public uitext    : UIText

    constructor(objectname : string, objectmesh : AbstractMesh, isPickable : Boolean){
        this.name = objectname;
        this.mesh = objectmesh;
    }

}