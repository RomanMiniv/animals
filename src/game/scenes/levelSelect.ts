import GameEngine from "../gameEngine";
import { EScene } from "../game";
import { Scene } from "./scene";
import { animalsConfig } from "@configs/configs";
import { IAnimal, IAnimals } from "../interfaces";
import { capitalize, getRandomIntInclusive } from "@utils";

export class LevelSelect extends Scene {
  declare data: IAnimals[];
  images: GameEngine.EngineObject[];

  gameInit(data?: unknown): void {
    super.gameInit(data);
    this.data = animalsConfig;

    this.setImages();
  }

  setImages(): void {
    this.images = [];

    const offset: number = 64;
    const y: number = GameEngine.mainCanvasSize.y / 7;

    this.data.forEach((animalsConfig, index) => {
      const imageSize: number = animalsConfig.spriteInfo.frames[0].frame.w;

      const textureInfoIndex = (GameEngine.textureInfos as GameEngine.TextureInfo[]).findIndex(textureInfo => textureInfo.image.currentSrc === animalsConfig.imageSpritePath);

      const animal: IAnimal = animalsConfig.animals[getRandomIntInclusive(0, animalsConfig.animals.length - 1)];
      const { frame } = animalsConfig.spriteInfo.frames.find(frame => frame.filename === animal.imagePath);

      const pos = !index ? GameEngine.vec2(-imageSize / 2 - offset, y) : GameEngine.vec2(+imageSize / 2 + offset, y);

      const image = new GameEngine.EngineObject(pos, GameEngine.vec2(frame.w, frame.h), GameEngine.tile(undefined, GameEngine.vec2(frame.w, frame.h), textureInfoIndex));
      image.tileInfo.pos = GameEngine.vec2(frame.x, frame.y);
      image.gravityScale = 0;

      this.images.push(image);
    });
  }
  clearImages(): void {
    this.images.forEach(image => {
      image.destroy();
    });
    this.images = [];
  }

  gameUpdate(): void {
    super.gameUpdate();

    if (GameEngine.mouseWasPressed(0)) {
      this.choiceListener();
    }
  }

  choiceListener(): void {
    for (let i = 0; i < this.images.length; i++) {
      const image = this.images[i];
      if (GameEngine.isOverlapping(image.pos, image.size, this.cursorImage.pos, this.cursorImage.size)) {
        this.finishCallback(EScene.LEVEL, this.data[i]);
        break;
      }
    }
  }

  gameRender(): void {
    super.gameRender();

    for (let i = 0; i < this.images.length; i++) {
      const image = this.images[i];
      if (GameEngine.isOverlapping(image.pos, image.size, this.cursorImage.pos, this.cursorImage.size)) {
        this.cursorImage.angleVelocity = 0.05;
        this.cursorImage.color = GameEngine.rgb(0, 128, 128, 1);

        const rectOffset = 10;
        GameEngine.drawRect(image.pos, GameEngine.vec2(image.size.x + rectOffset, image.size.y + rectOffset), GameEngine.WHITE);
        break;
      } else {
        this.cursorImage.angleVelocity = 0;
        this.cursorImage.color = GameEngine.rgb(1, 1, 1, 1);
      }
    }

    const size = 36;
    this.data.forEach((animalsConfig, index) => {
      const image = this.images[index];
      GameEngine.drawTextScreen(capitalize(animalsConfig.type), GameEngine.vec2(GameEngine.mainCanvasSize.x / 2 + image.pos.x, GameEngine.mainCanvasSize.y / 2 + image.pos.y - size / 2), size, GameEngine.rgb(1, 1, 1, 1));
    });

    this.setHint("Choose a type of animal");
  }

  finish(): void {
    super.finish();

    this.clearImages();
  }
}
