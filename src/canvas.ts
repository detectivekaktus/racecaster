const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

if (ctx) {
  ctx.fillStyle = "blue";
  ctx.fillRect(50, 50, 200, 200);
}
