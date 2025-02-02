import { Scene } from "./scene";
import { EScene } from "../game";
import GameEngine from "../gameEngine";
import { Emoji } from "@shared";

export class Intro extends Scene {
  particleEmitter: GameEngine.ParticleEmitter;

  gameUpdate(): void {
    super.gameUpdate();

    if (GameEngine.keyWasPressed("Enter") || GameEngine.keyWasPressed("Space")) {
      this.finishCallback(EScene.LEVEL_SELECT);
    }
  }
  gameRender(): void {
    super.gameRender();

    GameEngine.drawTextScreen("Do you know how animals sound?", GameEngine.vec2(GameEngine.mainCanvasSize.x / 2, GameEngine.mainCanvasSize.y / 3), 64, GameEngine.rgb(1, 1, 1, .8));

    // TODO: cat animation

    this.setHint(`Press Space or Enter to start ${Emoji.CAT}`);
  }
}
