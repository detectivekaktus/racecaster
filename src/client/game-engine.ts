class Car {
  readonly backSprite: HTMLImageElement;
  readonly leftSprite: HTMLImageElement;
  readonly rightSprite: HTMLImageElement;

  public speed: number;
  public maxSpeed: number;
  public direction: number;
  public distance: number;
  public curvature: number;
  public targetCurvature: number;
  public sprite: HTMLImageElement;

  constructor(maxSpeed: number, backSpritePath: string, leftSpritePath: string, rightSpritePath: string) {
    this.maxSpeed = maxSpeed;
    this.speed = 0.0;
    this.direction = 0;
    this.distance = 0.0;
    this.curvature = 0.0;
    this.targetCurvature = 0.0;

    this.backSprite = new Image();
    this.backSprite.src = backSpritePath;
    this.leftSprite = new Image();
    this.leftSprite.src = leftSpritePath;
    this.rightSprite = new Image();
    this.rightSprite.src = rightSpritePath;
    this.sprite = this.backSprite;
  }

  public update() {
    if (this.direction == 1) this.sprite = this.rightSprite;
    else if (this.direction == -1) this.sprite = this.leftSprite;
    else this.sprite = this.backSprite;
  }
}

interface RoadPiece {
  curvature:  number;
  distance:   number;
};

export interface GameOptions {
  pixel_size:       number
  grass_color_var1: string;
  grass_color_var2: string;
  clip_color_var1:  string;
  clip_color_var2:  string;
  road_color:       string;
};

export class GameEngine {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly options: GameOptions;
  
  public keysHeld: Set<string>;
  public startTime: number;
  public play: boolean;

  private road: RoadPiece[];
  private totalDistance: number;
  private targetCurvature: number;
  private car: Car;

  constructor(canvas: HTMLCanvasElement, options: GameOptions) {
    this.canvas = canvas;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Couldn't get canvas context.");
    this.ctx = ctx;
    this.options = options;
    this.keysHeld = new Set();

    this.startTime = 0;
    this.play = true;

    this.car = new Car(2.0, "assets/car.png", "assets/car_left.png", "assets/car_right.png");
    this.road = [];
    this.totalDistance = 0;
    this.targetCurvature = 0;
    this.onCreate();
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private onCreate() {
    this.road.push({ curvature: 0.0, distance: 100.0 } as RoadPiece);
    this.road.push({ curvature: 0.0, distance: 500.0 } as RoadPiece);
    this.road.push({ curvature: 1.0, distance: 1000.0 } as RoadPiece);
    this.road.push({ curvature: 0.5, distance: 500.0 } as RoadPiece);
    this.road.push({ curvature: -0.5, distance: 250.0 } as RoadPiece);
    this.road.push({ curvature: -1.0, distance: 500.0 } as RoadPiece);
    this.road.push({ curvature: 0.0, distance: 1000.0 } as RoadPiece);
    this.computeTotalDistance();
  }

  private computeTotalDistance() {
    let distance = 0;
    for (let i = 0; i < this.road.length; i++)
      distance += this.road[i].distance;
    this.totalDistance = distance;
  }

  private getCurrentRoadPiece() : number {
    let sum = 0; for (let i = 0; i < this.road.length; i++) {
      sum += this.road[i].distance;
      if (this.car.distance <= sum) return i;
    }
    return 0;
  }

// The core logic of the game is written by Javidx9
// Here's a Github link to his implementation of the game logic in C++.
// https://github.com/OneLoneCoder/Javidx9/blob/master/ConsoleGameEngine/
// SmallerProjects/OneLoneCoder_RetroArcadeRacer.cpp
//
// My implementation heavely relies on his logic.
  public update(deltaTime: number) {
    if (this.car.distance >= this.totalDistance) {
      this.car.distance = 0;
      return;
    }

    if (this.keysHeld.has('w')) this.car.speed += 5 * deltaTime;
    else this.car.speed -= 2 * deltaTime;
    if      (this.keysHeld.has('a') && !this.keysHeld.has('d') && this.car.speed > 0) {
      this.car.direction = -1;
      this.car.curvature -= 0.7 * deltaTime;
    }
    else if (this.keysHeld.has('d') && !this.keysHeld.has('a') && this.car.speed > 0) {
      this.car.direction = 1;
      this.car.curvature += 0.7 * deltaTime;
    }
    else this.car.direction = 0;

    if (Math.abs(this.targetCurvature - this.car.curvature) > 0.7) this.car.speed -= 10 * deltaTime;
    if (this.car.speed > 2) this.car.speed = 2;
    if (this.car.speed < 0) this.car.speed = 0;

    this.car.distance += (100 * this.car.speed) * deltaTime;

    const roadPiece = this.road[this.getCurrentRoadPiece()];
    this.targetCurvature += (roadPiece.curvature - this.targetCurvature) * deltaTime * this.car.speed;

    this.resizeCanvas();
    const width: number = Math.floor(this.canvas.width / this.options.pixel_size);
    const height: number = Math.floor(this.canvas.height / this.options.pixel_size);

    for (let y = 0; y < height / 2; y++) {
      for (let x = 0; x < width; x++) {
        const perspective = 0.2 + y / height * 2.5;
        const center = 0.5 + this.targetCurvature * Math.pow(1 - perspective, 2);

        let roadWidth = 0.65 * perspective;
        const roadBoundaryWidth = roadWidth * 0.1;
        roadWidth *= 0.5;

        const leftGrass = (center - roadWidth - roadBoundaryWidth) * this.canvas.width;
        const leftClip = (center - roadWidth) * this.canvas.width;
        const rightClip = (center + roadWidth) * this.canvas.width;
        const rightGrass = (center + roadWidth + roadBoundaryWidth) * this.canvas.width;

        const grassColor: string = Math.sin(20 * Math.pow(1 - perspective, 3) + this.car.distance * 0.1) > 0 ?
          this.options.grass_color_var1 :
          this.options.grass_color_var2;
        const clipColor: string = Math.sin(40 * Math.pow(1 - perspective, 3) + this.car.distance * 0.1) > 0 ?
          this.options.clip_color_var1 :
          this.options.clip_color_var2;

        const pixelized_x = x * this.options.pixel_size;
        const pixelized_y = this.canvas.height / 2 + y * this.options.pixel_size;
        if      (pixelized_x >= 0 && pixelized_x <= leftGrass) this.ctx.fillStyle = grassColor;
        else if (pixelized_x > leftGrass && pixelized_x <= leftClip) this.ctx.fillStyle = clipColor;
        else if (pixelized_x > leftClip && pixelized_x < rightClip) this.ctx.fillStyle = this.options.road_color;
        else if (pixelized_x >= rightClip && pixelized_x < rightGrass) this.ctx.fillStyle = clipColor;
        else if (pixelized_x >= rightGrass) this.ctx.fillStyle = grassColor;
        this.ctx.fillRect(pixelized_x, pixelized_y, this.options.pixel_size, this.options.pixel_size);
      }
    }

    this.car.update();
    const midPoint = 0.5 * this.canvas.width;
    const carXPos = midPoint + midPoint * -(this.targetCurvature - this.car.curvature);
    const carSprite = this.car.sprite;
    const carWidth = carSprite.width / 2;
    const carHeight = carSprite.height / 2;
    this.ctx.drawImage(
      carSprite,
      carXPos - carWidth / 2,
      this.canvas.height - carWidth + this.options.pixel_size * 20,
      carWidth,
      carHeight 
    );
  }
}
