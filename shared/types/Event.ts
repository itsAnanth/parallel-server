import { Client } from "discord.js";

interface Event {
    name: string;
    execute: (bot: Client) => void;
}

type EventPayload = {
    name: string;
    execute: (bot: Client) => void;
}

export type { Event, EventPayload };
