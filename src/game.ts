const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
if (!ctx) throw new Error("No context gotten from the canvas");

const PIXEL_SIZE: number = 5;
let play: boolean = true;
let startTime: number = 0;

let distance: number = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function game(deltaTime: number) {
  const width: number = Math.floor(canvas.width / PIXEL_SIZE);
  const height: number = Math.floor(canvas.height / PIXEL_SIZE);

  if (heldKey == 'w') distance += 5;

  for (let y = 0; y < height / 2; y++) {
    for (let x = 0; x < width; x++) {
      const perspective = 0.2 + y / height * 2.5;
      let roadWidth = 0.65 * perspective;
      const roadBoundaryWidth = roadWidth * 0.1;
      roadWidth *= 0.5;

      const leftGrass = (0.5 - roadWidth - roadBoundaryWidth) * canvas.width;
      const leftClip = (0.5 - roadWidth) * canvas.width;
      const rightClip = (0.5 + roadWidth) * canvas.width;
      const rightGrass = (0.5 + roadWidth + roadBoundaryWidth) * canvas.width;

      const grassColor: string = Math.sin(20 * Math.pow(1 - perspective, 3) + distance * 0.1) > 0 ? "#6dc728" : "#52ab0e";
      const clipColor: string = Math.sin(40 * Math.pow(1 - perspective, 3) + distance * 0.1) > 0 ? "#e0e0e0" : "#ff4040";

      const pixelized_x = x * PIXEL_SIZE;
      const pixelized_y = canvas.height / 2 + y * PIXEL_SIZE;
      if      (pixelized_x >= 0 && pixelized_x <= leftGrass) ctx.fillStyle = grassColor;
      else if (pixelized_x > leftGrass && pixelized_x <= leftClip) ctx.fillStyle = clipColor;
      else if (pixelized_x > leftClip && pixelized_x < rightClip) ctx.fillStyle = "#6b6666";
      else if (pixelized_x >= rightClip && pixelized_x < rightGrass) ctx.fillStyle = clipColor;
      else if (pixelized_x >= rightGrass) ctx.fillStyle = grassColor;
      ctx.fillRect(pixelized_x, pixelized_y, PIXEL_SIZE, PIXEL_SIZE);
    }
  }
}

function draw(timestamp: number) {
  if (!startTime) startTime = timestamp;
  const deltaTime = timestamp - startTime;

  resizeCanvas();
  game(deltaTime);

  if (play) requestAnimationFrame(draw);
}

let keyHeld = false;
let heldKey: string = "";

document.addEventListener("keydown", (event) => {
  if (!keyHeld) {
    keyHeld = true;
    heldKey = event.key;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key == heldKey) {
    keyHeld = false;
    heldKey = "";
  }
})

requestAnimationFrame(draw)
