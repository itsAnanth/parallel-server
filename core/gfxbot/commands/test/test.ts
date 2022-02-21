import { CollectorFilter, MessageActionRow, MessageButton } from "discord.js";
import { Message } from "../../../../shared/types/Message";
import Command from "../../../../modules/Command";
import messageCollector from "../../../../modules/messageCollector";

export default new Command({
    name: 'test',
    cooldown: 5,
    execute: async function (message) {
        const self = this;
        const filter = x => x.author.id == message.author.id;
        const data = {};

        const queries = [
            { text: 'enter design info', field: 'info' },
            { text: 'enter timeframe', field: 'time' },
            { text: 'enter payment', field: 'payment' }
        ];

        for (let i = 0; i < queries.length; i++) {
            const msg = await message.replyEmbed({ description: queries[i].text });
            const res = await messageCollector(message, filter, 10000);
            if (!res) return message.replyEmbed({
                description: 'tooslow'
            });
            data[queries[i].field] = res.content;
            msg.delete();
        }

        const btns = [
            new MessageButton().setStyle('SUCCESS').setLabel('Finish').setCustomId('finish'),
            new MessageButton().setStyle('PRIMARY').setLabel('Edit').setCustomId('edit'),
            new MessageButton().setStyle('DANGER').setLabel('Discard').setCustomId('discard')
        ];


        const msg = await message.channel.send(
            {
                embeds: [message.createEmbed({ description: Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n') })],
                components: [new MessageActionRow().addComponents(...btns)]
            }
        )

        const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 });
        collector.on('collect', async i => {
            if (message.handleInteraction(i)) return;
            if (i.customId === 'finish') message.reply('done');
            else if (i.customId === 'discard') message.reply('discarded')
            else if (i.customId === 'edit') message.reply('edit');
        msg.delete();
        collector.stop();
    });

collector.on('end', (i) => { if (i.size == 0) (msg as Message).disableComponents() });


console.log(data);
    }
})