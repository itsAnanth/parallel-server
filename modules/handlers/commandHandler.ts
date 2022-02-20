import fs from 'fs';
import { Collection } from 'discord.js';
import Client from '../Client';


async function handleCommands(bot: Client, dir: { absolutePath: string, path: string, name: string }) {
    let commands = new Collection();
    
    // @ts-ignore
    bot.commands = commands;
    const commandFolders = fs.readdirSync(dir.absolutePath);
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`${dir.absolutePath}/${folder}`).filter(file => file.endsWith('.ts'));
        for (const file of commandFiles) {
            let command = await import(`../../core/${dir.name}/commands/${folder}/${file}`);
            command = command.default;
            command.module = folder;
            (bot as Client).commands.set(command.name, command);
            console.log('[command handler]', `${command.name}.js`);
        }
    }
}

export default handleCommands;

