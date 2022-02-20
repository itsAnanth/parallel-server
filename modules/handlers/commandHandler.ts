import fs from 'fs';
import { Collection, Client as dClient } from 'discord.js';

interface Client extends dClient {
    commands: Collection<string, any>;
}

async function handleCommands(bot: dClient, dir: { absolutePath: string, path: string }) {
    let command = new Collection();
    Object.assign(bot, command);

    const commandFolders = fs.readdirSync(dir.absolutePath);
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`${dir}/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            let command = await import(`${dir.path}/${folder}/${file}`);
            command = command.default;
            command.module = folder;
            (bot as Client).commands.set(command.name, command);
            console.log('[command handler]', `${command.name}.js`);
        }
    }
}

export default handleCommands;

