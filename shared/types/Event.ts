import { Client } from "discord.js";

interface Event {
    name: string;
    execute: (bot: Client) => Promise<void>;
}

type EventPayload = {
    name: string;
    execute: (bot: Client) => Promise<void>;
}

export type { Event, EventPayload };
