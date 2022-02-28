import fs from 'fs';
import Dyno from './Dyno';

interface Server {
    shards: Map<string, Dyno>;
    ignore: string[]
}

class Server {
    constructor(ignore?: string[]) {
        this.shards = new Map();
        this.ignore = ignore ? ignore : [];
    }

    async __init__() {
        const core = fs.readdirSync('./core');
        for (let i = 0; i < core.length; i++) {
            if (this.ignore.includes(core[i])) {
                console.log('App blacklisted, skipping ' + core[i]);
                continue;
            }
            let dyno = await import(`../core/${core[i]}/dyno.ts`);
            dyno = dyno.default;
            if (!dyno) continue;
            this.setShard(i, (dyno as Dyno));
        }

        console.log(`Loaded ${this.shards.size} shards`)
    }

    async start() {
        const shards = [...this.shards.values()];
        for (let i = 0; i < shards.length; i++) {
            const dyno = shards[i];
            await dyno.run();
        }
    }

    setShard(id: number|string, shard: Dyno) {
        this.shards.set(this.to_string(id), shard);
    }

    getShard(id: number|string) {
        return this.shards.get(this.to_string(id));
    }

    deleteShard(id: number|string) {
        this.shards.delete(this.to_string(id));
    }

    to_string(arg: number|string) {
        return typeof arg === 'number' ? arg.toString() : arg;
    }
}

export default Server;