import { setTimer } from "@utils";
import GameEngine, { IEngineScene } from "../gameEngine";
import CatPawPath from "@assets/images/paw.png";

export abstract class Scene implements IEngineScene {
  data: unknown;
  animations: Map<string, () => void>;
  cursorImage: GameEngine.EngineObject;

  finishCallback: (data?: unknown) => void;

  constructor(finishCallback: (data?: any) => void) {
    this.finishCallback = (data?: any) => {
      this.finish();
      finishCallback(data);
    };
    this.animations = new Map();
  }

  gameInit(data?: unknown): void {
    this.data = data;
    this.setCursorImage();
  }

  setCursorImage(): void {
    const textureInfoIndex = (GameEngine.textureInfos as GameEngine.TextureInfo[]).findIndex(textureInfo => textureInfo.image.currentSrc === CatPawPath);
    const textureInfo = GameEngine.textureInfos[textureInfoIndex];

    this.cursorImage = new GameEngine.EngineObject(GameEngine.mousePos, GameEngine.vec2(40), GameEngine.tile(0, textureInfo.size, textureInfoIndex));
    this.cursorImage.renderOrder = 2;

    GameEngine.overlayCanvas.style.cursor = "none";
  }

  gameUpdate(): void {
    this.cursorImage.pos = GameEngine.mousePos;

    this.animations.forEach(animation => animation());
  }

  async createAnimation(name: string, func: () => void, duration: number): Promise<void> {
    this.animations.set(name, func);
    await setTimer(duration);
    this.animations.delete(name);
  }

  gameUpdatePost(): void {
  }

  gameRender(): void {
  }

  gameRenderPost(): void {
  }

  setCursorStyle(style: string = ""): void {
    GameEngine.overlayCanvas.style.cursor = style;
  }

  finish(): void {
    this.cursorImage.destroy();
    this.setCursorStyle();
    // TODO: delete animations
  }

  setHint(text: string): void {
    GameEngine.drawTextScreen(text, GameEngine.vec2(GameEngine.mainCanvasSize.x / 2, GameEngine.mainCanvasSize.y - GameEngine.mainCanvasSize.y / 4 + 48), 24, GameEngine.rgb(1, 1, 0, .8), undefined, undefined, undefined, "Courier New");
  }
}
