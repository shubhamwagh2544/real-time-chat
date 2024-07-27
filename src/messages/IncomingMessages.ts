import zod, { string } from "zod";

const JOIN_ROOM: string = "JOIN_ROOM";
const SEND_MESSAGE: string = "SEND_MESSAGE";
const UPVOTE_MESSAGE: string = "UPVOTE_MESSAGE";

export enum SupportedMessage {
  JoinRoom = "JOIN_ROOM",
  SendMessage = "SEND_MESSAGE",
  UpVoteMessage = "UPVOTE_MESSAGE",
}

export type IncomingMessage =
  | {
      type: SupportedMessage.JoinRoom;
      payload: InitMessageType;
    }
  | {
      type: SupportedMessage.SendMessage;
      payload: UserMessageType;
    }
  | {
      type: SupportedMessage.UpVoteMessage;
      payload: UpVoteMessageType;
    };

export const InitMessage = zod.object({
  name: zod.string(),
  userId: zod.string(),
  roomId: zod.string(),
});

export type InitMessageType = zod.infer<typeof InitMessage>;

export const UserMessage = zod.object({
  userId: zod.string(),
  roomId: zod.string(),
  message: zod.string(),
});

export type UserMessageType = zod.infer<typeof UserMessage>;

export const UpVoteMessage = zod.object({
  userId: zod.string(),
  roomId: zod.string(),
  chatId: zod.string(),
});

export type UpVoteMessageType = zod.infer<typeof UpVoteMessage>;
