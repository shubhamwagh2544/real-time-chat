import { connection } from "websocket";

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
}
