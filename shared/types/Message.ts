import { GuildMember, User, Message as dMessage } from 'discord.js';

type sendEmbedPayload = { color?: string, description: string, footer?: string, author?: User };

interface Message {
    getUser: (id: string) => User|null;
    getMember: (id: string) => GuildMember|null;
    sendEmbed: (payload: sendEmbedPayload) => dMessage;
}

export type { Message };