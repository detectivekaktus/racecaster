import { GameEngine, GameOptions } from "./game-engine";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const engine = new GameEngine(canvas,
  {
    pixel_size:       5,
    grass_color_var1: "#6dc728",
    grass_color_var2: "#52ab0e",
    clip_color_var1:  "#e0e0e0",
    clip_color_var2:  "#ff4040",
    road_color:       "#6b6666"
  } as GameOptions
);

document.addEventListener("keydown", (event) => engine.keysHeld.add(event.key));
document.addEventListener("keyup",   (event) => engine.keysHeld.delete(event.key));

function update(timestamp: number) {
    if (!engine.startTime) engine.startTime = timestamp;
    const deltaTime = timestamp - engine.startTime;
    engine.update(deltaTime);
    if (engine.play) requestAnimationFrame(update);
}

requestAnimationFrame(update);
