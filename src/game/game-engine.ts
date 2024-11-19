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

  private distance: number = 0;
  private totalDistance: number = 0;
  private road: RoadPiece[];

  constructor(canvas: HTMLCanvasElement, options: GameOptions) {
    this.canvas = canvas;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Couldn't get canvas context.");
    this.ctx = ctx;
    this.options = options;
    this.keysHeld = new Set();
    this.startTime = 0;
    this.play = true;
    this.road = [];
    this.onCreate();
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private onCreate() {
    this.road.push({ curvature: 0.0, distance: 100.0 } as RoadPiece);
    this.road.push({ curvature: 0.0, distance: 200.0 } as RoadPiece);
    this.road.push({ curvature: 1.0, distance: 300.0 } as RoadPiece);
    this.road.push({ curvature: 0.5, distance: 200.0 } as RoadPiece);
    this.road.push({ curvature: -0.5, distance: 400.0 } as RoadPiece);
    this.road.push({ curvature: -1.0, distance: 400.0 } as RoadPiece);
    this.road.push({ curvature: 0.0, distance: 800.0 } as RoadPiece);
    this.computeTotalDistance();
    console.log(this.totalDistance);
  }

  private computeTotalDistance() {
    let distance = 0;
    for (let i = 0; i < this.road.length; i++)
      distance += this.road[i].distance;
    this.totalDistance = distance;
  }

  private getCurrentRoadPiece() : number {
    let sum = 0;
    for (let i = 0; i < this.road.length; i++) {
      sum += this.road[i].distance;
      if (this.distance <= sum) return i;
    }
    return -1;
  }

  public update(deltaTime: number) {
    if (this.distance >= this.totalDistance) {
      alert("You completed the level.");
      this.play = false;
      return;
    }

    const roadPieceIndex = this.getCurrentRoadPiece();
    if (roadPieceIndex == -1) throw new Error("Couldn't get the road piece.");
    const roadPiece = this.road[roadPieceIndex];

    this.resizeCanvas();
    const width: number = Math.floor(this.canvas.width / this.options.pixel_size);
    const height: number = Math.floor(this.canvas.height / this.options.pixel_size);

    if (this.keysHeld.has('w')) this.distance += 100 * deltaTime;

    for (let y = 0; y < height / 2; y++) {
      for (let x = 0; x < width; x++) {
        const center = 0.5 + roadPiece.curvature;
        const perspective = 0.2 + y / height * 2.5;
        let roadWidth = 0.65 * perspective;
        const roadBoundaryWidth = roadWidth * 0.1;
        roadWidth *= 0.5;

        const leftGrass = (center - roadWidth - roadBoundaryWidth) * this.canvas.width;
        const leftClip = (center - roadWidth) * this.canvas.width;
        const rightClip = (center + roadWidth) * this.canvas.width;
        const rightGrass = (center + roadWidth + roadBoundaryWidth) * this.canvas.width;

        const grassColor: string = Math.sin(20 * Math.pow(1 - perspective, 3) + this.distance * 0.1) > 0 ?
          this.options.grass_color_var1 :
          this.options.grass_color_var2;
        const clipColor: string = Math.sin(40 * Math.pow(1 - perspective, 3) + this.distance * 0.1) > 0 ?
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
  }
}
