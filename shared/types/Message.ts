import { GuildMember, User, Message as dMessage, MessageEmbed, ButtonInteraction } from 'discord.js';

type sendEmbedPayload = { color?: string, description: string, footer?: string, author?: User };

interface Message extends dMessage {
    getUser: (id: string) => Promise<User | null>;
    getMember: (id: string) => Promise<GuildMember | null>;
    sendEmbed: (payload: sendEmbedPayload) => Promise<Message>;
    replyEmbed: (payload: sendEmbedPayload) => Promise<Message>;
    createEmbed: (payload: sendEmbedPayload) => MessageEmbed;
    handleInteraction: (interaction: ButtonInteraction) => boolean;
    disableComponents: () => void;
}

export type { Message };