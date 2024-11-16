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

  for (let y = 0; y < height / 2; y++) {
    for (let x = 0; x < width; x++) {
      const leftGrass = canvas.width * 0.225;
      const leftBoundary = leftGrass + canvas.width * 0.05;
      const road = leftBoundary + canvas.width * 0.45;
      const rightBoundary = road + canvas.width * 0.05;
      const rightGrass = rightBoundary + canvas.width * 0.225;

      if (x * PIXEL_SIZE <= leftGrass) ctx.fillStyle = "green";
      else if (x * PIXEL_SIZE <= leftBoundary && x * PIXEL_SIZE > leftGrass) ctx.fillStyle = "red";
      else if (x * PIXEL_SIZE <= road && x * PIXEL_SIZE > leftBoundary) ctx.fillStyle = "gray";
      else if (x * PIXEL_SIZE <= rightBoundary && x * PIXEL_SIZE > road) ctx.fillStyle = "red";
      else if (x * PIXEL_SIZE <= rightGrass && x * PIXEL_SIZE > rightBoundary) ctx.fillStyle = "green";
      ctx.fillRect(x * PIXEL_SIZE, canvas.height / 2 + y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
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
