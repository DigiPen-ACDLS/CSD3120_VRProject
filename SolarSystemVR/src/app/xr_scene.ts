/**
  @fileoverview   Implementation for a generic scene class.
  @author         Diren D Bharwani, 2002216
*/

//=============================================================================
// Type Definitions
//=============================================================================

/**
 * The type of the XRScene.
 */
export enum XRMode{ VR, AR };

export class XRScene
{
  //===========================================================================
  // Data Members
  //===========================================================================

  private   type            : XRMode;

  // Babylon components

  private   scene           : BABYLON.Scene;
  private   featuresManager : BABYLON.WebXRFeaturesManager;

  // Scene Objects

  //===========================================================================
  // Constructors & Destructor
  //===========================================================================

  constructor(mode: XRMode, engine: BABYLON.Engine)
  {
    this.type = mode;

    // Hide the inspector by default.
    this.scene = new BABYLON.Scene(engine);
    this.scene.debugLayer.hide();
  }

  //===========================================================================
  // Public Member Functions
  //===========================================================================

  /**
   * Call this function after the scene has been setup to create the VR experience.
   * @param debugMode If toggling of the inspector is enabled. Use CTRL + ALT + I to toggle.
   */
  public async Init(debugMode: boolean)
  {
    const xrMode: XRSessionMode = this.type === XRMode.VR ? "immersive-vr" : "immersive-ar";

    const xr = await this.scene.createDefaultXRExperienceAsync({
      uiOptions: { sessionMode: xrMode }
    });

    (window as any).xr = xr;

    // Enable toggling of the scene's inspector
    if (debugMode)
    {
      window.addEventListener('keydown', e => {
        if (e.altKey && e.ctrlKey && e.key === 'i')
        {
          if (this.scene.debugLayer.isVisible())
            this.scene.debugLayer.hide();
          else
            this.scene.debugLayer.show();
        } 
      });
    }

    // Attach the features manager. Features can be enabled through another experience
    this.featuresManager = xr.baseExperience.featuresManager;
  } 
  
};