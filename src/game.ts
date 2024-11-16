const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
if (!ctx) throw new Error("No context gotten from the canvas");

const PIXEL_SIZE: number = 10;
let play: boolean = true;
let startTime: number = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawGame(deltaTime: number) {
  const width: number = Math.floor(canvas.width / PIXEL_SIZE);
  const height: number = Math.floor(canvas.height / PIXEL_SIZE);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      ctx.fillStyle = (x + y) % 2 == 0 ? "white" : "silver";
      ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    }
  }
}

function draw(timestamp: number) {
  if (!startTime) startTime = timestamp;
  const deltaTime = timestamp - startTime;

  resizeCanvas();
  drawGame(deltaTime);

  if (play) requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
