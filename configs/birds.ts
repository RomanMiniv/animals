import birdsSprite from "@assets/images/birds/birds.png";
import birdsSpriteInfo from "@assets/images/birds/birds.json";

// TODO: make audio sprite
import accipiterNisusSoundPath from "@assets/sounds/birds/Accipiter nisus.mp3";
import aegoliusFunereusSoundPath from "@assets/sounds/birds/Aegolius funereus.mp3";
import anasPlatyrhynchosSoundPath from "@assets/sounds/birds/Anas platyrhynchos.mp3";
import aquilaChrysaetosSoundPath from "@assets/sounds/birds/Aquila chrysaetos.mp3";
import ardeaCinereaSoundPath from "@assets/sounds/birds/Ardea cinerea.mp3";
import atheneNoctuaSoundPath from "@assets/sounds/birds/Athene noctua.mp3";
import buboScandiacusSoundPath from "@assets/sounds/birds/Bubo scandiacus.mp3";
import buteoButeoSoundPath from "@assets/sounds/birds/Buteo buteo.mp3";
import coturnixCoturnixSoundPath from "@assets/sounds/birds/Coturnix coturnix.mp3";
import pandionHaliaetusSoundPath from "@assets/sounds/birds/Pandion haliaetus.mp3";
import strixAlucoSoundPath from "@assets/sounds/birds/Strix aluco.mp3";
import tytoAlbaSoundPath from "@assets/sounds/birds/Tyto alba.mp3";

import { IAnimals } from "../src/game/interfaces";

export const birdsConfig: IAnimals = {
  imageSpritePath: birdsSprite,
  spriteInfo: birdsSpriteInfo,
  type: "birds",
  soundText: "What bird is singing?",
  badge: "🐦",
  animals: [
    {
      name: "Accipiter nisus",
      imagePath: "Accipiter nisus.jpg",
      soundPath: accipiterNisusSoundPath
    },
    {
      name: "Aegolius funereus",
      imagePath: "Aegolius funereus.jpg",
      soundPath: aegoliusFunereusSoundPath
    },
    {
      name: "Anas platyrhynchos",
      imagePath: "Anas platyrhynchos.jpg",
      soundPath: anasPlatyrhynchosSoundPath
    },
    {
      name: "Aquila chrysaetos",
      imagePath: "Aquila chrysaetos.jpg",
      soundPath: aquilaChrysaetosSoundPath
    },
    {
      name: "Ardea cinerea",
      imagePath: "Ardea cinerea.jpg",
      soundPath: ardeaCinereaSoundPath
    },
    {
      name: "Athene noctua",
      imagePath: "Athene noctua.jpg",
      soundPath: atheneNoctuaSoundPath
    },
    {
      name: "Bubo scandiacus",
      imagePath: "Bubo scandiacus.jpg",
      soundPath: buboScandiacusSoundPath
    },
    {
      name: "Buteo buteo",
      imagePath: "Buteo buteo.jpg",
      soundPath: buteoButeoSoundPath
    },
    {
      name: "Coturnix coturnix",
      imagePath: "Coturnix coturnix.jpg",
      soundPath: coturnixCoturnixSoundPath
    },
    {
      name: "Pandion haliaetus",
      imagePath: "Pandion haliaetus.jpg",
      soundPath: pandionHaliaetusSoundPath
    },
    {
      name: "Strix aluco",
      imagePath: "Strix aluco.jpg",
      soundPath: strixAlucoSoundPath
    },
    {
      name: "Tyto alba",
      imagePath: "Tyto alba.jpg",
      soundPath: tytoAlbaSoundPath
    },
  ]
};

