import { CollectorFilter, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { Message } from "../../../../shared/types/Message";
import Command from "../../../../modules/Command";
import messageCollector from "../../../../modules/messageCollector";
import BtnTypes, { status } from "../../utils/BtnTypes";

export default new Command({
    name: 'test',
    cooldown: 5,
    execute: async function (message, args, bot) {
        const self = this;
        const filter = x => x.author.id == message.author.id;
        const data: { info?: string, payment?: string, time?: string } = {};

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

        // const embed = message.createEmbed({ description: Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n') });

        const embed = new MessageEmbed()
            .setColor('GREY')
            .setTitle('Commission Request')
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
            .setDescription(`${data.info}`)
            .addField('Time Frame', `${data.time}`)
            .addField('Payment', `${data.payment}`)
            

        const msg = await message.channel.send(
            {
                embeds: [embed],
                components: [new MessageActionRow().addComponents(...btns)]
            }
        )

        const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 10000 });
        collector.on('collect', async i => {
            if (message.handleInteraction(i)) return;
            if (i.customId === 'finish') finalize(embed);
            else if (i.customId === 'discard') message.reply('discarded')
            else if (i.customId === 'edit') await (self as Command).execute(message, args, bot);
            msg.delete();
            collector.stop();
        });

        collector.on('end', (i) => { if (i.size == 0) (msg as Message).disableComponents() });


        function finalize(embed: MessageEmbed) {
            const btns = [
                new MessageButton().setStyle('SUCCESS').setLabel('Accept').setCustomId(`f_${BtnTypes.OPEN}_${message.author.id}`)
            ];

            embed.setFooter({ text: `Status: ${status[BtnTypes.OPEN]} Open` })

            message.channel.send({ embeds: [embed], components: [new MessageActionRow().addComponents(...btns)] });
        }
    }
})