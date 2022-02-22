import { Intents } from 'discord.js';
import Client from '../../modules/Client';
import handleCommands from '../../modules/handlers/commandHandler';
import handleEvents from '../../modules/handlers/eventHandler';
handleEvents


const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES],
    bot = new Client('.', { intents: intents });

export default async function() {
    await handleEvents(bot, {
        absolutePath: `./core/gfxbot/events`,
        path: '../events',
        name: 'chatbot'
    });

    await handleCommands(bot, { 
        absolutePath: `./core/gfxbot/commands`, 
        path: '../commands',
        name: 'chatbot'
    });
    
    bot.login(process.env.GFXBOT_TOKEN);
}