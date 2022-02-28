import { CollectorFilter, Formatters, MessageActionRow, MessageButton, MessageEmbed, Permissions } from "discord.js";
import { Message } from "../../../../shared/types/Message";
import messageCollector from "../../../../modules/messageCollector";
import BtnTypes, { status } from "../../utils/BtnTypes";
import Command from "../../../../modules/Commands/MessageCommand";

export default new Command({
    name: 'submit',
    aliases: ['request', 'post'],
    cooldown: 5,
    required: [],
    execute: async function (message, args, bot) {
        const self = this;
        const filter: CollectorFilter<[Message]> = x => x.author.id == message.author.id;
        const data: { info?: string, payment?: string, time?: string } = {};
        const discordLink = 'https://discord.com/users/';
        let attachment = null;

        const queries = [
            { text: 'Please provide a brief info about what you\'re looking for (Attachment optional)', field: 'info' },
            { text: 'Please provide a time frame', field: 'time' },
            { text: 'Please provide a Budget & payment method', field: 'payment' }
        ];

        for (let i = 0; i < queries.length; i++) {
            const msg = await message.sendEmbedDM({
                description: queries[i].text,
                color: 'AQUA'
            });

            if (!msg) return;

            const res = await messageCollector(msg, filter, 120000);

            if (!res) return msg.sendEmbed({
                description: 'Request timed out, please try again',
                color: 'RED'
            });

            const attachments = [...res.attachments.values()];
            if (attachments.length != 0) attachment = attachments[0].url;
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
            .setDescription(`:dollar: **Budget:** ${data.payment}\n\n:date: **Time Frame:** ${data.time}\n\n:bust_in_silhouette: **Client:** ${Formatters.userMention(message.author.id)} (*${Formatters.hyperlink(message.author.tag, `${discordLink}/${message.author.id}`)}*)\n\n`)
            .addField('\n\u200b\n:page_facing_up: Brief', `${Formatters.codeBlock(data.info)}`)

        attachment && (embed.setImage(attachment));

        let msg: Message;
        try {
            msg = (await message.author.send(
                {
                    embeds: [embed],
                    components: [new MessageActionRow().addComponents(...btns)]
                }
            ) as Message);
        } catch (e) {
            console.error('at submit.ts ln 66' + e);
            return;
        }

        const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 20000 });
        collector.on('collect', async i => {
            if (message.handleInteraction(i)) return;
            if (i.customId === 'finish') finalize(embed);
            else if (i.customId === 'discard') message.replyEmbed({
                color: 'GREEN',
                description: 'Successfully discarded request template'
            });
            else if (i.customId === 'edit') {
                await (self as Command).execute(message, args, bot);
                await msg.delete().catch(console.error);
            }
            await msg.delete().catch(console.error);
            collector.stop();
        });

        collector.on('end', async (i, reason) => {
            if (i.size == 0) (msg as Message).disableComponents()
            if (msg.deletable)
                await msg.delete().catch(console.error);

            console.log(reason);
            if (reason == 'time') {
                msg.sendEmbed({
                    color: 'RED',
                    description: 'Request timed out, please try again'
                });
            }
        });


        function finalize(embed: MessageEmbed) {
            const btns = [
                new MessageButton().setStyle('SUCCESS').setLabel('Mark As Ongoing').setCustomId(`f_${BtnTypes.OPEN}_${message.author.id}`)
            ];

            embed.setFooter({ text: `Status: ${status[BtnTypes.OPEN]} Open` })

            message.channel.send({ embeds: [embed], components: [new MessageActionRow().addComponents(...btns)] });
        }
    }
})