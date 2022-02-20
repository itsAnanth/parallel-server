import fs from 'fs';
import { Client } from 'discord.js';

async function handleEvents(bot: Client, dir: { absolutePath: string, path: string }) {
    const eventsFolder = fs.readdirSync(dir.absolutePath).filter(x => x.endsWith('js') && x != 'index.js');
    for (const file of eventsFolder) {
        let event = await import(`${dir.path}/${file}`);
        event = event.default;
        bot.on(event.name.toString(), event.execute.bind(null, bot));
        console.log('[event handler]', `${event.name}`);
    }
}

export default handleEvents;