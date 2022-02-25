import { Message, Client } from 'discord.js';
import type { Message as IMessage } from './Message';

type allowPayload = {
    permissions?: number[];
    roles?: string[];
    ids?: string[]
}

type allow = {
    permissions: number[];
    roles: string[];
    ids: string[];
}

interface CommandPayload {
    name: string;
    description?: string;
    expectedArgs?: string;
    cooldown?: number;
    aliases?: string[];
    allow?: allowPayload;
    required?: bigint[];
    dev?: boolean;
    execute: (message: IMessage, args: string[], bot: Client) => Promise<any>;
}

interface Command {
    name: string;
    description: string;
    expectedArgs: string;
    cooldown: number;
    aliases: string[];
    allow: allow;
    required: bigint[];
    dev: boolean;

    execute: (message: IMessage, args: string[], bot: Client) => Promise<any>;
}

export type { Command, allow, CommandPayload, allowPayload }
