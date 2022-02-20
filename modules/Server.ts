import fs from 'fs';

interface Server {
    shards: Map<string, any>;
}

class Server {
    constructor() {
        this.shards = new Map();
    }

    async __init__() {
        const core = fs.readdirSync('./core');
        for (let i = 0; i < core.length; i++) {
            let dyno = await import(`../core/${core[i]}/dyno.ts`);
            dyno = dyno.default;
            if (!dyno) continue;
            this.setShard(i, dyno);
        }

        console.log(`Loaded ${this.shards.size} shards`)
    }

    start() {
        const shards = [...this.shards.values()];
        for (let i = 0; i < shards.length; i++) {
            const dyno = shards[i];
            dyno.run();
        }
    }

    setShard(id: number|string, shard: any) {
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