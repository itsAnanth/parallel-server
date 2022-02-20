import Client from "../../modules/Client";
import { Message } from "./Message";

interface Event {
    name: string;
    execute: (bot: Client) => Promise<any>;
}

type EventPayload = {
    name: string;
    execute: (bot: Client, message?: Message) => Promise<any>;
}

export type { Event, EventPayload };
