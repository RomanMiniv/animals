import GameEngine, { IEngineScene } from "./gameEngine";
import { Scene } from "./scenes/scene";
import { animalsConfig } from "@configs/configs";
import { Intro } from "./scenes/intro";
import { LevelSelect } from "./scenes/levelSelect";
import { Level } from "./scenes/level";
import { LevelResult } from "./scenes/levelResult";
import { Gratitude } from "./scenes/gratitude";

import CatPawPath from "@assets/images/paw.png";

export enum EScene {
  INTRO,
  LEVEL_SELECT,
  LEVEL,
  LEVEL_RESULT,
  GRATITUDE,
}

export type TSceneFinishCallback = (sceneIndex?: EScene, data?: unknown) => void;

export default class Game implements IEngineScene {
  scenes: Scene[] = [];
  activeSceneIndex: number = -1;

  constructor() {
    GameEngine.engineInit(
      this.gameInit.bind(this),
      this.gameUpdate.bind(this), this.gameUpdatePost.bind(this),
      this.gameRender.bind(this), this.gameRenderPost.bind(this),
      [
        CatPawPath,
        ...animalsConfig.map(_ => _.imageSpritePath),
      ]
    );
  }

  nextScene(sceneIndex?: number, data?: unknown): void {
    this.activeSceneIndex = sceneIndex ?? this.activeSceneIndex + 1;
    this.scenes = [].concat(this.sceneFactory());
    this.scenes.forEach(scene => scene.gameInit(data));
  }

  sceneFactory(): Scene | Scene[] {
    switch (this.activeSceneIndex) {
      case EScene.INTRO:
        return new Intro((sceneIndex?: EScene, data?: unknown) => {
          this.nextScene(sceneIndex, data);
        });
      case EScene.LEVEL_SELECT:
        return new LevelSelect((sceneIndex?: EScene, data?: unknown) => {
          this.nextScene(sceneIndex, data);
        });
      case EScene.LEVEL:
        return new Level((sceneIndex?: EScene, data?: unknown) => {
          this.nextScene(sceneIndex, data);
        });
      case EScene.LEVEL_RESULT:
        return new LevelResult((sceneIndex?: EScene, data?: unknown) => {
          this.nextScene(sceneIndex, data);
        });
      case EScene.GRATITUDE:
        return new Gratitude((sceneIndex?: EScene, data?: unknown) => {
          this.nextScene(sceneIndex, data);
        });
    }
  }

  gameInit(): void {
    GameEngine.setCameraScale(1);
    GameEngine.setGravity(1);
    GameEngine.setFontDefault("Garamond");

    this.nextScene();
  }

  gameUpdate(): void {
    this.scenes.forEach(scene => scene.gameUpdate());
  }

  gameUpdatePost(): void {
    this.scenes.forEach(scene => scene.gameUpdatePost());
  }

  gameRender(): void {
    this.scenes.forEach(scene => scene.gameRender());
  }

  gameRenderPost(): void {
    this.scenes.forEach(scene => scene.gameRenderPost());
  }
}
