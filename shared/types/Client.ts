import { Collection, Client as dClient } from "discord.js";
import Command from "../../modules/Command";

interface Client extends dClient {
    commands: Collection<string, Command>;
    prefix: string;
}

export type { Client };
