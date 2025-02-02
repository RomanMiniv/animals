import GameEngine from "../gameEngine";
import { Scene } from "./scene";
import { capitalize, getRandomIntInclusive, setTimer, shuffle } from "@utils";
import { Emoji } from "@shared";
import { EScene } from "../game";
import { IAnimal, IAnimals } from "../interfaces";

export interface ILevelResult {
  total: number;
  correct: number;
  badge: string;
}

export class Level extends Scene {
  animalsConfig: IAnimals;
  animals: IAnimal[][];
  images: GameEngine.EngineObject[];
  sound: GameEngine.SoundWave;

  currentStep: number;
  isAvailableNextStep: boolean;
  isFinish: boolean;
  result: ILevelResult;

  gameInit(data?: unknown): void {
    super.gameInit(data);
    this.animalsConfig = this.data as IAnimals;

    this.initAnimals();

    this.result = {
      total: this.animals.length,
      correct: this.animals.length,
      badge: this.animalsConfig.badge,
    };

    this.currentStep = 0;
    this.nextStep();
  }

  initAnimals(): void {
    this.images = [];
    this.animals = [];

    const { animals } = this.animalsConfig;

    shuffle(animals);
    if (animals.length % 2 !== 0) {
      throw new Error("Number of elements must be even.");
    }

    animals.forEach(animal => {
      const animalCopy = Object.assign({}, animal);
      let lastIndex: number = this.animals.length - 1;
      if (this.animals[lastIndex]?.length === 2) {
        lastIndex++;
      }
      if (!Array.isArray(this.animals[lastIndex])) {
        this.animals.push([animalCopy]);
      } else {
        this.animals[lastIndex].push(animalCopy);
      }
    });

    this.animals.forEach(animals => {
      animals[getRandomIntInclusive(0, animals.length - 1)].isActiveSound = true;
    });
  }


  nextStep(): void {
    this.isAvailableNextStep = true;

    this.sound?.stop();
    const { soundPath } = this.animals[this.currentStep].find(animal => animal.isActiveSound);
    this.sound = new GameEngine.SoundWave(soundPath, undefined, undefined, undefined, () => {
      this.sound.play(undefined, undefined, undefined, undefined, true);
    });

    this.setImages();
  }

  setImages(): void {
    const offset = 64;
    const imageSize = this.animalsConfig.spriteInfo.frames[0].frame.w;
    const y = GameEngine.mainCanvasSize.y / 7;

    this.clearImages()

    this.animals[this.currentStep].forEach((animal, index) => {
      const textureInfoIndex = (GameEngine.textureInfos as GameEngine.TextureInfo[]).findIndex(textureInfo => textureInfo.image.currentSrc === this.animalsConfig.imageSpritePath); // TODO: clarify type as GameEngine.TextureInfo[]
      const { frame } = this.animalsConfig.spriteInfo.frames.find(frame => frame.filename === animal.imagePath);

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

        const isWin: boolean = !!this.animals[this.currentStep][i].isActiveSound;

        if (++this.currentStep === this.animals.length) {
          this.isFinish = true;
        }

        this.setChoiceStatus(i, isWin).then(() => {
          if (this.isFinish) {
            this.finishCallback(EScene.LEVEL_RESULT, this.result);
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
      await this.correctChoiceAnimation(imageIndex, saturation, duration);
    } else {
      this.result.correct--;
      await this.wrongChoiceAnimation(imageIndex, saturation, duration);
    }
  }
  async correctChoiceAnimation(imageIndex: number, saturation: number, duration: number): Promise<void> {
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
  }
  async wrongChoiceAnimation(imageIndex: number, saturation: number, duration: number): Promise<void> {
    this.images[imageIndex].additiveColor = GameEngine.rgb(saturation, 0, 0, 1);

    let deltaIterator: number = 0;
    let deltaIteratorStep: number = 1;
    let isFirstStep: boolean = true;
    let direction: number = -1;
    const initialDeltaOffset: number = 2;
    await this.createAnimation("wrongChoice", () => {
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
    const text = `${this.currentStep} / ${this.animals.length}    ${Emoji.CAT}`;
    GameEngine.drawTextScreen(text, GameEngine.vec2(text.length * 5, size * 1.5), size, GameEngine.rgb(1, 1, 1, 1));
  }

  renderStep(): void {
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

    let currentStep = this.isFinish ? this.currentStep - 1 : this.currentStep;
    if (!this.isFinish && !this.isAvailableNextStep) {
      currentStep--;
    }

    const animals = this.animals[currentStep];
    const size = 36;
    animals.forEach((animal, index) => {
      const image = this.images[index];
      GameEngine.drawTextScreen(capitalize(animal.name), GameEngine.vec2(GameEngine.mainCanvasSize.x / 2 + image.pos.x, GameEngine.mainCanvasSize.y / 2 + image.pos.y - size / 2), size, GameEngine.rgb(1, 1, 1, 1));
    });

    // TODO: provide as parameter
    this.setHint(this.animalsConfig.soundText);
  }
}
