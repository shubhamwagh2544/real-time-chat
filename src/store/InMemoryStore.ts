import { Chat, Store, UserId } from "./Store";

let globalChatId = 0;

export interface Room {
  roomId: string;
  chats: Chat[];
}

export class InMemoryStore implements Store {
  private store: Map<string, Room>;
  constructor() {
    this.store = new Map<string, Room>();
  }

  initRoom(roomId: string): void {
    this.store.set(roomId, {
      roomId,
      chats: [],
    });
  }

  // limit, offset :> for ex. last 50 chats
  getChats(roomId: string, limit: number, offset: number) {
    const room = this.store.get(roomId);
    if (!room) {
      return [];
    }
    return room.chats
      .reverse()
      .slice(0, offset)
      .slice(-1 * limit);
  }

  addChat(roomId: string, userId: UserId, name: string, message: string) {
    if (!this.store.get(roomId)) {
      this.initRoom(roomId);
    }
    const room = this.store.get(roomId);
    if (!room) {
      console.log("Room not Found");
      return;
    } else {
      let chat: Chat = {
        chatId: (globalChatId++).toString(),
        userId,
        name,
        message,
        upvotes: [],
      };
      room.chats.push(chat);
      return chat;
    }
  }

  upvote(roomId: string, chatId: string, userId: UserId) {
    const room = this.store.get(roomId);
    if (!room) {
      return;
    }
    // Todo: Make this faster
    const chat = room.chats.find((chat) => chat.chatId === chatId);
    if (chat) {
      chat.upvotes.push(userId);
    }
    return chat;
  }
}
