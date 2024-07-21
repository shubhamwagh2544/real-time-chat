export type UserId = string;

export interface Chat {
  chatId: string;
  userId: UserId;
  name: string;
  message: string;
  upvotes: UserId[]; // who has upvoted what
}

export abstract class Store {
  constructor() {}

  initRoom(roomId: string) {}

  getChats(room: string, limit: number, offset: number) {}

  addChat(room: string, userId: UserId, name: string, message: string) {}

  upvote(room: string, chatId: string, userId: UserId) {}
}
