import Client from "../../modules/Client";
import { Message } from "./Message";

interface Event {
    name: string;
    execute: (bot: Client) => Promise<void>;
}

type EventPayload = {
    name: string;
    execute: (bot: Client, message?: Message) => Promise<void>;
}

export type { Event, EventPayload };
