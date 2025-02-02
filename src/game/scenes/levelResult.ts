import GameEngine from "../gameEngine";
import { EScene } from "../game";
import { Scene } from "./scene";
import { ILevelResult } from "./level";
import { setTimer } from "@utils";

export class LevelResult extends Scene {
  size: number = 36;
  declare data: ILevelResult;
  correct: number = 0;
  timer: GameEngine.Timer;
  isResultFinished: boolean;

  title = [
    "Result",
  ];

  gameInit(data?: unknown): void {
    super.gameInit(data);

    this.title.push(this.getResultInfo())
    this.timer = new GameEngine.Timer(2);

    this.setScoreAnimation().then(() => {
      this.isResultFinished = true;
    });
  }

  async setScoreAnimation(): Promise<void> {
    for (let i = 0; i < this.data.correct; i++) {
      await setTimer(500);
      this.correct++;
      this.title[this.title.length - 1] = this.getResultInfo();
    }
  }
  getResultInfo(): string {
    return `Score: ${this.correct}/${this.data.total} ${this.data.badge}`;
  }

  gameUpdate(): void {
    super.gameUpdate();

    if (this.isResultFinished) {

      if (GameEngine.keyWasPressed("KeyR")) {
        this.finishCallback(EScene.LEVEL_SELECT);
      } else if (GameEngine.keyWasPressed("KeyE")) {
        this.finishCallback(EScene.GRATITUDE);
      }
    }
  }

  gameRender(): void {
    super.gameRender();

    this.title.forEach((part, index) => {
      GameEngine.drawTextScreen(part, GameEngine.vec2(GameEngine.mainCanvasSize.x / 2, GameEngine.mainCanvasSize.y / 3 + index * this.size * 2), this.size, GameEngine.rgb(0, 128, 128, 1), undefined, undefined, undefined, "Courier New");
    });

    if (this.isResultFinished) {
      this.setHint("Press R to restart or E to end");
    }
  }
}
