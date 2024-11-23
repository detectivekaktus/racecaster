import { createServer, IncomingMessage, ServerResponse } from "http";
import { readFile } from "fs";
import { join } from "path";
import { Logger } from "./utils/logging";

const logger = new Logger("server") as Logger;

function serve(req: IncomingMessage, res: ServerResponse<IncomingMessage>, filename: string, ctype: string) {
  readFile(join(__dirname, filename), (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }
    res.writeHead(200, { "Content-Type": ctype });
    res.end(data);
  });
}

const server = createServer((req, res) => {
  logger.info(`Got ${req.method} request to ${req.url} endpoint.`);

  switch (req.url) {
    case '/': {
      logger.info("Request hit home HTML page. Returning it.");
      serve(req, res, "html/index.html", "text/html");
    } break;

    case "/game": {
      logger.info("Request hit game HTML page. Returning it.");
      serve(req, res, "html/game.html", "text/html");
    } break;

    case "/styles/index.css": {
      logger.info("Request hit home CSS styles. Returning them.");
      serve(req, res, "styles/index.css", "text/css");
    } break;

    case "/styles/game.css": {
      logger.info("Request hit game CSS styles. Returning them.");
      serve(req, res, "styles/game.css", "text/css");
    } break;

    case "/main": {
      logger.info("Request hit main game logic. Returning it.");
      serve(req, res, "../client/main.js", "application/javascript");
    } break;

    case "/game-engine": {
      logger.info("Request hit the game engine logic. Returning it.");
      serve(req, res, "../client/game-engine.js", "application/javascript");
    } break;

    case "/car.png": {
      logger.info("Request hit the car image. Returning it.");
      serve(req, res, "assets/car.png", "image/png");
    } break;

    case "/car_left.png": {
      logger.info("Request hit the left car image. Returning it.");
      serve(req, res, "assets/car_left.png", "image/png");
    } break;

    case "/car_right.png": {
      logger.info("Request hit the right car image. Returning it.");
      serve(req, res, "assets/car_right.png", "image/png");
    } break;

    default: {
      logger.error("No content found for the request. Aborting.");
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    } break;
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  logger.info("Server is successfully hosted and is listening on 127.0.0.1:3000.");
  logger.warn("  For more functioning info try using --debug flag.");
  logger.warn("  If an error occurs, please follow the path `logs` and find the latest");
  logger.warn("  log file and submit it on Github at https://github.com/detectivekaktus/racecaster");
});
