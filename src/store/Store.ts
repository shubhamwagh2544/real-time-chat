export type UserId = string;

export interface Chat {
  userId: UserId;
  name: string;
  message: string;
  upvotes: UserId[]; // who has upvoted what
}

export abstract class Store {
  constructor() {}

  initRoom() {}

  getChats(room: string, limit: number, offset: number) {}

  addChat(room: string, limit: number, offset: number) {}

  upvote(room: string, chatId: string) {}
}
