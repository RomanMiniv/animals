import * as LittleJS from "littlejsengine";
export default LittleJS;

/**
 *  @param {Function} gameInit       - Called once after the engine starts up, setup the game
 *  @param {Function} gameUpdate     - Called every frame at 60 frames per second, handle input and update the game state
 *  @param {Function} gameUpdatePost - Called after physics and objects are updated, setup camera and prepare for render
 *  @param {Function} gameRender     - Called before objects are rendered, draw any background effects that appear behind objects
 *  @param {Function} gameFinish     - Called after scene deleted
 */
export interface IEngineScene {
  gameInit: Function;
  gameUpdate: Function;
  gameUpdatePost: Function;
  gameRender: Function;
  gameRenderPost: Function;
}
