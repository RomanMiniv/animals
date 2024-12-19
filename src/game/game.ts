import GameEngine, { IEngineScene } from "./gameEngine";
import { Scene } from "./scenes/scene";
import { catsConfig } from "../../configs/cats";
import { Intro } from "./scenes/intro";
import { Level } from "./scenes/level";
import { Gratitude } from "./scenes/gratitude";

import CatPawPath from "@assets/images/paw.png";

export enum EScene {
  INTRO,
  LEVEL,
  GRATITUDE,
}

export default class Game implements IEngineScene {
  scenes: Scene[] = [];
  activeSceneIndex: number = -1;

  constructor() {
    GameEngine.engineInit(
      this.gameInit.bind(this),
      this.gameUpdate.bind(this), this.gameUpdatePost.bind(this),
      this.gameRender.bind(this), this.gameRenderPost.bind(this),
      [CatPawPath, catsConfig.imageSpritePath]
    );
  }

  nextScene(sceneIndex?: number): void {
    this.activeSceneIndex = sceneIndex ?? this.activeSceneIndex + 1;
    this.scenes = [].concat(this.sceneFactory());
    this.scenes.forEach(scene => scene.gameInit());
  }

  sceneFactory(): Scene | Scene[] {
    switch (this.activeSceneIndex) {
      case EScene.INTRO:
        return new Intro((sceneIndex: EScene) => {
          this.nextScene(sceneIndex);
        });
      case EScene.LEVEL:
        return new Level((sceneIndex: EScene) => {
          this.nextScene(sceneIndex);
        });
      case EScene.GRATITUDE:
        return new Gratitude((sceneIndex: EScene) => {
          this.nextScene(sceneIndex);
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
