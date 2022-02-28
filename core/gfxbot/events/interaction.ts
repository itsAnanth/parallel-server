import { Interaction, MessageButton, MessageActionRow } from "discord.js"
import Event from '../../../modules/Event';
import BtnTypes, { status } from "../utils/BtnTypes";
import { Message } from "../../../shared/types/Message";
import SlashCommand from "../../../modules/Commands/SlashCommand";

export default new Event({
    name: 'interactionCreate',
    execute: async (bot, i: Interaction) => {
        if (i.isCommand()) {
            const command: SlashCommand = bot.slashcommands.get(i.commandName);
            if (command.guildOnly && !i.guild) return;
            if (!command) return i.reply({
                content: 'Unknown command',
                ephemeral: true
            })

            command.run(i);
        }

        if (!i.isButton()) return;

        const args = i.customId.split('_');
        const embed = i.message.embeds[0];

        if (args[0] != 'f') return;
        if (i.user.id != args[2]) return (i.message as Message).handleInteraction(i, args[2]);

        let buttons, type = parseInt(args[1]);
        if (type == BtnTypes.OPEN) {
            buttons = [
                new MessageButton().setStyle('DANGER').setLabel('Close Request').setCustomId(`f_${BtnTypes.CLOSE}_${args[2]}`),
                new MessageButton().setStyle('SUCCESS').setLabel('Reopen Request').setCustomId(`f_${BtnTypes.REOPEN}_${args[2]}`),
            ]
            embed.footer = { text: `Status: ${status[BtnTypes.ONGOING]} Ongoing` };
        } else if (type == BtnTypes.CLOSE) {
            buttons = [];
            embed.footer = { text: `Status: ${status[BtnTypes.CLOSE]} Closed` };
        } else if (type == BtnTypes.REOPEN) {
            buttons = [
                new MessageButton().setStyle('SUCCESS').setLabel('Mark As Ongoing').setCustomId(`f_${BtnTypes.OPEN}_${args[2]}`)
            ];
            embed.footer = { text: `Status: ${status[BtnTypes.OPEN]} Ongoing` };
        }



        const msgpayload = { embeds: [embed] };
        // @ts-ignore
        msgpayload.components = buttons.length != 0 ? [new MessageActionRow().addComponents(...buttons)] : [];
        i.update(msgpayload);
    }
})