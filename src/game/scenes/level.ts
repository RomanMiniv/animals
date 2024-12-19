import GameEngine from "../gameEngine";
import { Scene } from "./scene";
import { catsConfig, ICat } from "@configs/cats";
import { getRandomIntInclusive, setTimer, shuffle } from "@utils";
import { Emoji } from "@shared";
import { EScene } from "../game";

export class Level extends Scene {
  cats: ICat[][];
  images: GameEngine.EngineObject[];
  sound: GameEngine.SoundWave;

  currentStep: number;
  isAvailableNextStep: boolean;
  isFinish: boolean;

  gameInit(): void {
    super.gameInit();
    // TODO: take config as parameter from LevelManager, not from import

    this.initCats();
    this.currentStep = 0;

    this.nextStep();
  }

  initCats(): void {
    this.images = [];
    this.cats = [];

    const { cats } = catsConfig;

    shuffle(cats);
    if (cats.length % 2 !== 0) {
      throw new Error("Number of elements must be even.");
    }

    cats.forEach(cat => {
      let lastIndex: number = this.cats.length - 1;
      if (this.cats[lastIndex]?.length === 2) {
        lastIndex++;
      }
      if (!Array.isArray(this.cats[lastIndex])) {
        this.cats.push([cat]);
      } else {
        this.cats[lastIndex].push(cat);
      }
    });

    this.cats.forEach(cats => {
      cats[getRandomIntInclusive(0, cats.length - 1)].isActiveSound = true;
    });
  }


  nextStep(): void {
    this.isAvailableNextStep = true;

    this.sound?.stop();
    const { soundPath } = this.cats[this.currentStep].find(cat => cat.isActiveSound);
    this.sound = new GameEngine.SoundWave(soundPath, undefined, undefined, undefined, () => {
      this.sound.play(undefined, undefined, undefined, undefined, true);
    });

    this.setImages();
  }

  setImages(): void {
    const offset = 64;
    const imageSize = catsConfig.spriteInfo.frames[0].frame.w;
    const y = GameEngine.mainCanvasSize.y / 7;

    this.clearImages()

    this.cats[this.currentStep].forEach((cat, index) => {
      const textureInfoIndex = (GameEngine.textureInfos as GameEngine.TextureInfo[]).findIndex(textureInfo => textureInfo.image.currentSrc === catsConfig.imageSpritePath); // TODO: clarify type as GameEngine.TextureInfo[]
      const { frame } = catsConfig.spriteInfo.frames.find(frame => frame.filename === cat.imagePath);

      const pos = !index ? GameEngine.vec2(-imageSize / 2 - offset, y) : GameEngine.vec2(+imageSize / 2 + offset, y);

      const image = new GameEngine.EngineObject(pos, GameEngine.vec2(frame.w, frame.h), GameEngine.tile(undefined, GameEngine.vec2(frame.w, frame.h), textureInfoIndex));
      image.tileInfo.pos = GameEngine.vec2(frame.x, frame.y); // TODO: cause in GameEngine.tile(pos), pos - can't do
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
    if (!this.isAvailableNextStep) {
      return;
    }

    for (let i = 0; i < this.images.length; i++) {
      const image = this.images[i];
      if (GameEngine.isOverlapping(image.pos, image.size, this.cursorImage.pos, this.cursorImage.size)) {
        this.isAvailableNextStep = false;

        const isWin: boolean = !!this.cats[this.currentStep][i].isActiveSound;

        if (++this.currentStep === this.cats.length) {
          this.isFinish = true;
        }

        this.setChoiceStatus(i, isWin).then(() => {
          if (this.isFinish) {
            this.finishCallback(EScene.GRATITUDE);
          } else {
            this.nextStep();
          }
        });

        break;
      }
    }
  }

  async setChoiceStatus(imageIndex: number, isWin: boolean): Promise<void> {
    const saturation: number = .2;
    const duration: number = 2000;

    if (isWin) {
      this.images[imageIndex].additiveColor = GameEngine.rgb(0, saturation, 0, 1);

      const particleTime: number = (duration - 200) / 1000;
      const color = GameEngine.rgb(0, saturation, 0, 1);
      const particleEmitter = new GameEngine.ParticleEmitter(
        this.images[imageIndex].pos, 0, // pos, angle
        this.images[imageIndex].size, .1, 200, GameEngine.PI, // emitSize, emitTime, emitRate, emiteCone
        undefined,  // tileInfo
        color, color, // colorStartA, colorStartB
        undefined, undefined, // colorEndA, colorEndB
        // undefined, undefined, undefined, undefined,
        particleTime, 20, 0, .1, .1,  // time, sizeStart, sizeEnd, speed, angleSpeed
        .99, .95, 1, GameEngine.PI, // damp, angleDamp, gravity, cone
        .1, .5, false, true // fade, randomness, collide, additive
      );

      await setTimer(duration);
      particleEmitter.destroy();
    } else {
      this.images[imageIndex].additiveColor = GameEngine.rgb(saturation, 0, 0, 1);

      let deltaIterator: number = 0;
      let deltaIteratorStep: number = 1;
      let isFirstStep: boolean = true;
      let direction: number = -1;
      const initialDeltaOffset: number = 2;
      await this.createAnimation("choiceStatus", () => {
        let delta: number;
        if (isFirstStep) {
          delta = initialDeltaOffset;
          isFirstStep = false;
        } else {
          delta = initialDeltaOffset * 2;
        }

        const offsets = [];
        for (let i = 0; i < 2; i++) {
          offsets.push(deltaIteratorStep * direction);
        }

        const { x, y } = this.images[imageIndex].pos;
        this.images[imageIndex].pos = GameEngine.vec2(x + offsets[0], y);

        if (++deltaIterator >= delta) {
          direction *= -1;
          deltaIterator = 0;
        }
      }, duration);
    }
  }

  finish(): void {
    super.finish();

    this.sound.stop();
    this.sound = null;

    this.clearImages();
  }

  gameRender(): void {
    super.gameRender();

    this.renderStatus();

    this.renderStep()
  }

  renderStatus(): void {
    const size = 18;
    const text = `${this.currentStep} / ${this.cats.length}    ${Emoji.CAT}`;
    GameEngine.drawTextScreen(text, GameEngine.vec2(text.length * 5, size * 1.5), size, GameEngine.rgb(1, 1, 1, 1));
  }

  renderStep(): void {
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

    let currentStep = this.isFinish ? this.currentStep - 1 : this.currentStep;
    if (!this.isFinish && !this.isAvailableNextStep) {
      currentStep--;
    }
    const cats = this.cats[currentStep];
    const size = 36;
    GameEngine.drawTextScreen(cats[0].name, GameEngine.vec2(GameEngine.mainCanvasSize.x / 3.4, GameEngine.mainCanvasSize.y / 1.6), size, GameEngine.rgb(1, 1, 1, 1));
    GameEngine.drawTextScreen(cats[1].name, GameEngine.vec2(GameEngine.mainCanvasSize.x - GameEngine.mainCanvasSize.x / 3.4, GameEngine.mainCanvasSize.y / 1.6), size, GameEngine.rgb(1, 1, 1, 1));

    this.setHint("Which cat purrs?");
  }
}
