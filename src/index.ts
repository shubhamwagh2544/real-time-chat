import { WebSocketServer } from "ws";
import http from "http";

const server = http.createServer(function (request: any, response: any) {
  response.writeHead(404);
  response.end();
});

const wss = new WebSocketServer({
  port: 8080,
  server: server,
});

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  ws.on('message', function (message) {
  })
});
