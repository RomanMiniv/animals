export interface IAnimals {
  imageSpritePath: string;
  spriteInfo: ISprite;
  type: string;
  soundText: string;
  badge: string;
  animals: IAnimal[];
}

export interface IAnimal {
  name: string;
  imagePath: string;
  soundPath: string;
  isActiveSound?: boolean;
}

export interface ISprite {
  frames: ISpriteFrame[];
}

export interface ISpriteFrame {
  filename: string;
  frame: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  sourceSize: {
    w: number;
    h: number;
  };
}
