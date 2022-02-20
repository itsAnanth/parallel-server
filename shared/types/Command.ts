import { Message, Client } from 'discord.js';

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
    execute: (message: Message, args: string[], bot: Client) => Promise<void>;
}

interface Command {
    name: string;
    description: string;
    expectedArgs: string;
    cooldown: number;
    aliases: string[];
    allow: allow;
    required: bigint[];

    execute: (message: Message, args: string[], bot: Client) => Promise<void>;
}

export type { Command, allow, CommandPayload, allowPayload }
