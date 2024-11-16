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
      const perspective = 0.2 + y / height * 2.5;
      let roadWidth = 0.55 * perspective;
      const roadBoundaryWidth = roadWidth * 0.1;

      roadWidth *= 0.5;

      const leftGrass = (0.5 - roadWidth - roadBoundaryWidth) * canvas.width;
      const leftClip = (0.5 - roadWidth) * canvas.width;
      const rightClip = (0.5 + roadWidth) * canvas.width;
      const rightGrass = (0.5 + roadWidth + roadBoundaryWidth) * canvas.width;

      const pixelized_x = x * PIXEL_SIZE;
      const pixelized_y = canvas.height / 2 + y * PIXEL_SIZE;
      if      (pixelized_x >= 0 && pixelized_x <= leftGrass) ctx.fillStyle = "green";
      else if (pixelized_x > leftGrass && pixelized_x <= leftClip) ctx.fillStyle = "red";
      else if (pixelized_x > leftClip && pixelized_x < rightClip) ctx.fillStyle = "gray";
      else if (pixelized_x >= rightClip && pixelized_x < rightGrass) ctx.fillStyle = "red";
      else if (pixelized_x >= rightGrass) ctx.fillStyle = "green";
      ctx.fillRect(pixelized_x, pixelized_y, PIXEL_SIZE, PIXEL_SIZE);
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
