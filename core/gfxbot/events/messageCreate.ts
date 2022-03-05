import Event from "../../../modules/Event"
import { Collection, MessageEmbed } from 'discord.js';
import devs from '../data/devs.json';
import Command from "../../../modules/Commands/MessageCommand";
import { Message } from "../../../shared/types/Message";

export default new Event({
    name: 'messageCreate',
    execute: async (bot, message: Message) => {

        const reactionChannels = ['947982111103680562', '675168789410611210'];
        if (reactionChannels.includes(message.channel.id)) {
            await message.react('⭐');
            return;
        }

        const cooldowns = bot.cooldowns;
        /** Ignores:
        * - Bots
        * - Messages that don't start with bot prefix
        * - Banned users */

        if (!message.content.toLowerCase().startsWith(bot.prefix) || message.author.bot) return;
        // Maintenance mode
        if (devs.includes(message.author.id) && message.content.startsWith(`${bot.prefix}maintenance`) && message.content.split.length == 2) {
            bot.maintenance = message.content.split(' ')[1] == 'on' ? true : false;
            if (bot.maintenance) bot.user.setPresence({ activities: [{ name: 'Parallel Server', type: 'WATCHING' }], status: 'dnd' });
            else bot.user.setPresence({ activities: [{ name: 'Parallel Server', type: 'WATCHING' }], status: 'online' });
            message.channel.send({ content: `maintenance mode ${bot.maintenance ? 'enabled' : 'disabled'}` });
        }

        const args = message.content.substring(bot.prefix.length).trim().split(' '),
            commandName = args.shift().toLowerCase(),
            command: Command = bot.messagecommands.get(commandName) || bot.messagecommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        if (command.guildOnly && !message.guild) return;

        if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

        const now = Date.now(),
            timestamps = cooldowns.get(command.name),
            expirationTime = timestamps.get(message.author.id) + ((command.cooldown || 0) * 1000);

        if (!devs.includes(message.author.id) && timestamps.has(message.author.id)) {
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000,
                    time = timeLeft / 60;
                let seconds: string;

                if (parseInt(time.toFixed(0)) < 1) seconds = `${timeLeft.toFixed(1)} second(s)`;
                else seconds = `${time.toFixed(1)} minute(s)`;

                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor('YELLOW')
                        .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
                        .setTitle('Whoa whoa hold on...')
                        .setDescription(`You need to wait \`${seconds}\` before reusing the \`${command.name}\` command.`)
                        .setFooter({ text: 'not stonks' })], failIfNotExists: false
                });
            } else timestamps.delete(message.author.id);
        }
        if (!bot.maintenance) {
            try {
                // message.timestamps = timestamps;
                // // if (!(await isStaff(command, message))) return;
                // if (!(evalCommand(command, message) && await isStaff(command, message))) return;
                // if (!checkPermissions.apply(command, [message])) return;
                await command.run(message, args, bot);
                timestamps.set(message.author.id, now);
            } catch (error) { console.log(error); }
        } else {
            message.reply({
                embeds: [new MessageEmbed()
                    .setDescription('```diff\n- The bot commands are disabled for maintenance , please try again later``` \n<a:tools:830536514303295518> [Join our support server](https://discord.gg/DfhQDQ8e8c)')
                    .setColor('NOT_QUITE_BLACK')
                    .setURL('https://discord.gg/DfhQDQ8e8c')], failIfNotExists: false
            }
            ).catch(e => console.log(e));
        }
    }
})