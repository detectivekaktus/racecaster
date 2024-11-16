import { createServer } from "http";
import { readFile } from "fs";
import { join } from "path";

import { Logger } from "./utils/logging";

export const logger = new Logger() as Logger;

const PORT = 3000;
const server = createServer((req, res) => {
  logger.info(`Got ${req.method} request. Processing...`);

  switch (req.url) {
    case '/': {
      logger.info("Serving main page.");

      readFile(join(__dirname, "index.html"), (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      });
    } break;

    case "/styles/style.css": {
      logger.info("Serving CSS styles.");
      
      readFile(join(__dirname, "/styles/style.css"), (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);
      });
    } break;

    case '/game.js': {
      logger.info("Serving game logic.");

      readFile(join(__dirname, "game.js"), (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(data);
      });
    } break;

    default: {
      logger.error("No content found for the request. 404 returned.");
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    } break;
  }
});

server.listen(PORT, () => {
  logger.info("Server is successfully hosted and is listening on 127.0.0.1:3000.");
  logger.warn("  For more functioning info try using --debug flag.\n");
  logger.warn("  If an error occurs, please follow the path `logs` and find the latest");
  logger.warn("  log file and submit it on Github at https://github.com/detectivekaktus/racecaster");
});
