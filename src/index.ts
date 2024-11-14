import { createServer } from "http";
import { readFile } from "fs";
import { join } from "path";

const PORT = 3000;
const server = createServer((req, res) => {
  switch (req.url) {
    case '/': {
      readFile(join(__dirname, "index.html"), (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        }
        else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
    } break;

    case '/canvas.js': {
      readFile(join(__dirname, "canvas.js"), (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        }
        else {
          res.writeHead(200, { "Content-Type": "application/javascript" });
          res.end(data);
        }
      });
    } break;

    default: {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    } break;
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
