import { createServer } from "http";

const PORT = 3000;
const server = createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Hello World");
});

server.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
