import { GameEngine, GameOptions, Gradient } from "./game-engine";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const engine = new GameEngine(canvas,
  {
    pixel_size:       5,
    sky_gradient: {
      color1: "#1c5564",
      color2: "#579bab",
      color3: "#9be5e9"
    } as Gradient,
    grass_color_var1: "#6dc728",
    grass_color_var2: "#52ab0e",
    clip_color_var1:  "#e0e0e0",
    clip_color_var2:  "#ff4040",
    road_color:       "#6b6666"
  } as GameOptions
);

document.addEventListener("keydown", (event) => engine.keysHeld.add(event.key));
document.addEventListener("keyup",   (event) => engine.keysHeld.delete(event.key));

function update(timestamp: DOMHighResTimeStamp) {
  const mils = timestamp / 1000;
  if (!engine.startTime) engine.startTime = mils;
  const deltaTime = mils - engine.startTime;
  engine.startTime = mils;
  engine.update(deltaTime);
  if (engine.play) requestAnimationFrame(update);
}

requestAnimationFrame(update);
