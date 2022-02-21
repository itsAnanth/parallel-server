import { Interaction, MessageButton, MessageActionRow } from "discord.js"
import Command from "../../../modules/Command"
import type { Event as IEvent } from "../../../shared/types/Event";
import Event from '../../../modules/Event';
import BtnTypes, { status } from "../utils/BtnTypes";
import { Message } from "../../../shared/types/Message";

export default new Event({
    name: 'interactionCreate',
    execute: async (bot, i: Interaction) => {
        if (!i.isButton()) return;

        const args = i.customId.split('_');
        const embed = i.message.embeds[0];

        console.log(args, i.user.id);

        if (args[0] != 'f') return;
        if (i.user.id != args[2]) return (i.message as Message).handleInteraction(i, args[2]);

        let button, type = parseInt(args[1]);
        if (type == BtnTypes.OPEN) {
            button = new MessageButton().setStyle('DANGER').setLabel('Close Request').setCustomId(`f_${BtnTypes.CLOSE}_${args[2]}`);
            embed.footer = { text: `Status: ${status[BtnTypes.ONGOING]} Ongoing` };
        } else if (type == BtnTypes.CLOSE) {
            button = null;
            embed.footer = { text: `Status: ${status[BtnTypes.CLOSE]} Closed` };
        }



        i.update({ embeds: [embed], components: button ? [new MessageActionRow().addComponents(button)] : [] });
        console.log(i.customId);
    }
})