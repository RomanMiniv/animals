import GameEngine from "../gameEngine";
import { EScene } from "../game";
import { Scene } from "./scene";

export class Gratitude extends Scene {
  size: number = 36;

  title = [
    "Thanks for playing the game!",
    "Hope you had fun :).",
    "Good luck!"
  ];

  gameInit(data?: unknown): void {
    super.gameInit(data);

    setTimeout(() => {
      this.finishCallback(EScene.INTRO);
    }, 7500);
  }

  gameRender(): void {
    super.gameRender();

    this.title.forEach((part, index) => {
      GameEngine.drawTextScreen(part, GameEngine.vec2(GameEngine.mainCanvasSize.x / 2, GameEngine.mainCanvasSize.y / 3 + index * this.size * 2), this.size, GameEngine.rgb(0, 128, 128, 1), undefined, undefined, undefined, "Courier New");
    });
  }
}
