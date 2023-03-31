import { AbstractMesh, AssetsManager, AssetTaskState, GetEnvironmentBRDFTexture, Mesh, MeshAssetTask, MorphTargetsBlock, Scene, Texture, TextureAssetTask, TextureSampleType } from "babylonjs";
import { minmaxReduxPixelShader } from "babylonjs/Shaders/minmaxRedux.fragment";


export class AssetLoader
{
    public assetsManager : AssetsManager
    public num : number;
    private loadingTasks: Promise<AbstractMesh>[] = [];

    //===========================================================================
    // Constructors & Destructor
    //===========================================================================
    constructor(scene : Scene)
    {
        this.assetsManager = new AssetsManager(scene);
        this.num = 0;
    }

    //===========================================================================
    // Texture Loader
    //===========================================================================
    LoadTexture(filepath: string, name : string,  scene : Scene) : Promise<Texture>
    {
        //Promise to handle asynchronous operations
        return new Promise((resolve, reject) =>
        {

            const textureAsset = this.assetsManager.addTextureTask('texturetask', filepath);

            //Success
            textureAsset.onSuccess = (task) =>
            {
                task.texture.name = name;
                resolve(task.texture);
                console.log("Successfully Loaded: " + filepath);
            }
            
            //Failed
            textureAsset.onError = (task) => 
            {
                reject(task.texture);
                console.log("Failed to Load: " + filepath);
            }

            this.assetsManager.loadAsync();
        });
    }


    //===========================================================================
    // Mesh Loader
    //===========================================================================
    LoadMesh(filepath: string, name : string) : Promise<AbstractMesh> 
    {
        return new Promise((resolve, reject) => 
        {
            const meshAsset = this.assetsManager.addMeshTask('meshtask', '', filepath, '');

            //Success
            meshAsset.onSuccess = (task) => {
                task.loadedMeshes[0].name = name;
                resolve(task.loadedMeshes[0] as Mesh);
                console.log("Successfully Loaded: "  +  filepath);
            }

            //Failed
            meshAsset.onError = (task, message, exception) => {
                reject(exception);
                console.log("Failed to Load: " + filepath);
            }

            this.assetsManager.loadAsync();
        })
    }

    LoadMeshes(filepaths: string[], names: string[]) : Promise<AbstractMesh[]>
    {
        const promises = [];

        for(let i = 0; i < filepaths.length; i++)
        {
            promises.push(
                new Promise((resolve, reject) => {
                    const meshAsset = this.assetsManager.addMeshTask('meshtask' + i.toString(),
                    '',
                    filepaths[i],
                    '');

                    //Success
                    meshAsset.onSuccess = (task) => {
                        task.loadedMeshes[0].name = names[i];
                        resolve(task.loadedMeshes[0] as Mesh);
                        console.log("Successfully Loaded: " + filepaths[i]);
                    }

                    //Failed
                    meshAsset.onError = (task, message, exception) => {
                        reject(exception);
                        console.log("Failed to Load: " + filepaths[i]);
                    }

                })
                )
            }
            
        this.assetsManager.loadAsync();
        return Promise.all(promises);
    }

    Load() {
        this.assetsManager.loadAsync();
    }
};
