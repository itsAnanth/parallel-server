import { GuildMember, User, Message as dMessage } from 'discord.js';

type sendEmbedPayload = { color?: string, description: string, footer?: string, author?: User };

interface Message extends dMessage {
    getUser: (id: string) => Promise<User | null>;
    getMember: (id: string) => Promise<GuildMember | null>;
    sendEmbed: (payload: sendEmbedPayload) => Message;
    replyEmbed: (payload: sendEmbedPayload) => Message;
}

export type { Message };