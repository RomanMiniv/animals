import catsSprite from "@assets/images/cats/cats.png";
import catsSpriteInfo from "@assets/images/cats/cats.json";

// TODO: make audio sprite
import caracalSoundPath from "@assets/sounds/cats/caracal.mp3";
import cougarSoundPath from "@assets/sounds/cats/cougar.mp3";
import cheetahSoundPath from "@assets/sounds/cats/cheetah.mp3";
import jaguarSoundPath from "@assets/sounds/cats/jaguar.mp3";
import leopardSoundPath from "@assets/sounds/cats/leopard.mp3";
import lionSoundPath from "@assets/sounds/cats/lion.mp3";
import lynxSoundPath from "@assets/sounds/cats/lynx.mp3";
import servalSoundPath from "@assets/sounds/cats/serval.mp3";
import tigerSoundPath from "@assets/sounds/cats/tiger.mp3";
import wildcatSoundPath from "@assets/sounds/cats/wildcat.mp3";
import { IAnimals } from "../src/game/interfaces";

export const catsConfig: IAnimals = {
  imageSpritePath: catsSprite,
  spriteInfo: catsSpriteInfo,
  type: "cats",
  soundText: "Which cat purrs?",
  badge: "🐆",
  animals: [
    {
      name: "caracal",
      imagePath: "caracal.jpg",
      soundPath: caracalSoundPath
    },
    {
      name: "cheetah",
      imagePath: "cheetah.webp",
      soundPath: cheetahSoundPath
    },
    {
      name: "cougar",
      imagePath: "cougar.webp",
      soundPath: cougarSoundPath
    },
    {
      name: "jaguar",
      imagePath: "jaguar.jpg",
      soundPath: jaguarSoundPath
    },
    {
      name: "leopard",
      imagePath: "leopard.jpg",
      soundPath: leopardSoundPath
    },
    {
      name: "lion",
      imagePath: "lion.webp",
      soundPath: lionSoundPath
    },
    {
      name: "lynx",
      imagePath: "lynx.webp",
      soundPath: lynxSoundPath
    },
    {
      name: "serval",
      imagePath: "serval.jpg",
      soundPath: servalSoundPath
    },
    {
      name: "tiger",
      imagePath: "tiger.webp",
      soundPath: tigerSoundPath
    },
    {
      name: "wildcat",
      imagePath: "wildcat.jpg",
      soundPath: wildcatSoundPath
    },
  ]
};

