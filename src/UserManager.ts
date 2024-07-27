import { connection } from "websocket";
import { OutgoingMessage } from "./messages/OutgoingMessages";

interface User {
  id: string;
  name: string;
  connection: connection;
}

interface Room {
  users: User[];
}

export class UserManager {
  private rooms: Map<string, Room>;
  constructor() {
    this.rooms = new Map<string, Room>();
  }

  addUser(name: string, userId: string, roomId: string, connection: connection) {
    if (!this.rooms.get(roomId)) {
      this.rooms.set(roomId, {
        users: [],
      });
    }
    this.rooms.get(roomId)?.users.push({
      id: userId,
      name,
      connection,
    });
  }

  removeUser(userId: string, roomId: string) {
    const users = this.rooms.get(roomId)?.users;
    if (users) {
      users.filter((user) => user.id !== userId);
    }
  }

  getUser(roomId: string, userId: string): User | null {
    const user = this.rooms.get(roomId)?.users.find((user) => user.id === userId);
    return user ?? null;
  }

  broadcast(roomId: string, userId: string, message: OutgoingMessage) {
    const user = this.getUser(roomId, userId);
    if (!user) {
      console.log("User not Found");
      return;
    }
    const room = this.rooms.get(roomId);
    if (!room) {
      console.log("Room not Found");
      return;
    }
    this.rooms.get(roomId)?.users.forEach((user) => {
      user.connection.sendUTF(JSON.stringify(message));
    });
  }
}
