export interface GameOptions {
  pixel_size: number
  grass_color_var1: string;
  grass_color_var2: string;
  clip_color_var1: string;
  clip_color_var2: string;
  road_color: string;
}

export class GameEngine {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly options: GameOptions;
  
  public keysHeld: Set<string>;
  public startTime: number;
  public play: boolean;

  private distance: number;

  constructor(canvas: HTMLCanvasElement, options: GameOptions) {
    this.canvas = canvas;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Couldn't get canvas context.");
    this.ctx = ctx;
    this.options = options;
    this.keysHeld = new Set();
    this.startTime = 0;
    this.play = true;
    this.distance = 0;
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  public update(deltaTime: number) {
    this.resizeCanvas();
    const width: number = Math.floor(this.canvas.width / this.options.pixel_size);
    const height: number = Math.floor(this.canvas.height / this.options.pixel_size);

    if (this.keysHeld.has('w')) this.distance += 5;

    for (let y = 0; y < height / 2; y++) {
      for (let x = 0; x < width; x++) {
        const perspective = 0.2 + y / height * 2.5;
        let roadWidth = 0.65 * perspective;
        const roadBoundaryWidth = roadWidth * 0.1;
        roadWidth *= 0.5;

        const leftGrass = (0.5 - roadWidth - roadBoundaryWidth) * this.canvas.width;
        const leftClip = (0.5 - roadWidth) * this.canvas.width;
        const rightClip = (0.5 + roadWidth) * this.canvas.width;
        const rightGrass = (0.5 + roadWidth + roadBoundaryWidth) * this.canvas.width;

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
