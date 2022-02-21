import { Collection, Client as dClient } from "discord.js";
import Command from "../../modules/Command";

interface Client extends dClient {
    commands: Collection<string, Command>;
    prefix: string;
    cooldowns: Collection<string, Collection<string, number>>;
    maintenance: boolean;
}

export type { Client };
