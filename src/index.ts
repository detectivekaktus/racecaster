import { createServer, IncomingMessage, ServerResponse } from "http";
import { readFile } from "fs";
import { join } from "path";
import { Logger } from "./utils/logging";

export const logger = new Logger("server") as Logger;

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
  logger.info(`Got ${req.method} request to ${req.url}. Processing...`);

  switch (req.url) {
    case '/': {
      logger.info("Serving main page.");
      serve(req, res, "index.html", "text/html");
    } break;

    case "/styles/style.css": {
      logger.info("Serving CSS styles.");
      serve(req, res, "styles/style.css", "text/css");
    } break;

    case "/main": {
      logger.info("Serving game logic.");
      serve(req, res, "game/main.js", "application/javascript");
    } break;

    case "/game-engine": {
      logger.info("Serving game logic.");
      serve(req, res, "game/game-engine.js", "application/javascript");
    } break;

    default: {
      logger.error("No content found for the request. 404 returned.");
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    } break;
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  logger.info("Server is successfully hosted and is listening on 127.0.0.1:3000.");
  logger.warn("  For more functioning info try using --debug flag.\n");
  logger.warn("  If an error occurs, please follow the path `logs` and find the latest");
  logger.warn("  log file and submit it on Github at https://github.com/detectivekaktus/racecaster");
});
