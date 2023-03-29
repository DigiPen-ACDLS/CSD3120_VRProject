import { AssetsManager, GetEnvironmentBRDFTexture, Scene, Texture, TextureAssetTask } from "babylonjs";


export class TextureLoader{
    public assetsManager : AssetsManager
    public textureAsset : TextureAssetTask

    constructor(scene : Scene){
        this.assetsManager = new AssetsManager(scene);
    }


    LoadTexture(filepath: string, name : string,  scene : Scene){
            this.textureAsset = this.assetsManager.addTextureTask(name, filepath);
            this.textureAsset.onSuccess = function (task) {
                console.log("Loaded Texture: " + filepath);
            }

            this.textureAsset.onError = function (task){
                console.log("Failed to Load Texture: " + filepath);
            }
        }

    GetTexture() : Texture{
        return this.textureAsset.texture;
    }

    Load() {
        this.assetsManager.loadAsync();
    }
};
