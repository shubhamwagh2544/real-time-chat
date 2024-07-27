import { connection, server as WebSocketServer } from "websocket";
import http from "http";
import { UserManager } from "./UserManager";
import { OutgoingMessage, SupportedMessage as OutgoingSupportedMessage } from "./messages/OutgoingMessages";
import { InMemoryStore } from "./store/InMemoryStore";
import { IncomingMessage, SupportedMessage } from "./messages/IncomingMessages";

const server = http.createServer(function (request: any, response: any) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});

const userManager = new UserManager();
const store = new InMemoryStore();

server.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

function originIsAllowed(origin: string) {
  return true;
}

wsServer.on("request", function (request) {
  console.log("inside connect");

  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(new Date() + " Connection from origin " + request.origin + " rejected.");
    return;
  }

  const connection = request.accept();
  console.log(new Date() + " Connection accepted.");
  connection.on("message", function (message) {
    console.log('inside ws message');
    // Todo: Add rate limiting logic here
    if (message.type === "utf8") {
      try {
        messageHandler(JSON.parse(message.utf8Data), connection);
      } catch (error) {
        console.error('Error parsing message: ', error);
      }
    }
  });
});

function messageHandler(message: IncomingMessage, connection: connection) {
  console.log('inside message handler', message);
  if (message.type === SupportedMessage.JoinRoom) {
    const payload = message.payload;
    userManager.addUser(payload.name, payload.userId, payload.roomId, connection);
    console.log('user saved');
  }
  if (message.type === SupportedMessage.SendMessage) {
    const payload = message.payload;
    const user = userManager.getUser(payload.roomId, payload.userId);
    if (!user) {
      console.log("User not Found!");
      return;
    }
    let chat = store.addChat(payload.roomId, payload.userId, user.name, payload.message);
    if (!chat) {
      console.log("Chat not Found");
      return;
    }

    const outgoingPayload: OutgoingMessage = {
      type: OutgoingSupportedMessage.AddChat,
      payload: {
        chatId: chat?.chatId,
        roomId: payload.roomId,
        message: payload.message,
        name: user.name,
        upvotes: 0,
      },
    };
    userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
  }

  if (message.type === SupportedMessage.UpVoteMessage) {
    const payload = message.payload;
    const chat = store.upvote(payload.roomId, payload.chatId, payload.userId);
    const outgoingPayload: OutgoingMessage = {
      type: OutgoingSupportedMessage.UpdateChat,
      payload: {
        chatId: payload.chatId,
        roomId: payload.roomId,
        upvotes: chat?.upvotes.length,
      },
    };
    userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
  }
}
