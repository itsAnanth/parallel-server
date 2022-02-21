import { Client as dClient, ClientOptions, Collection } from 'discord.js';
import type { Client as IClient } from '../shared/types/Client';

interface Client extends IClient { };

class Client extends dClient {
    constructor(prefix: string, options: ClientOptions) {
        super(options);

        this.maintenance = false;
        this.cooldowns = new Collection();
        this.commands = new Collection();
        this.prefix = prefix;
    }
}

export default Client;
