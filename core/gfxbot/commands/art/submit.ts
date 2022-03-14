import { CollectorFilter, Formatters, MessageActionRow, MessageButton, MessageEmbed, Permissions } from "discord.js";
import { Message } from "../../../../shared/types/Message";
import messageCollector from "../../../../modules/messageCollector";
import BtnTypes, { status } from "../../utils/BtnTypes";
import Command from "../../../../modules/Commands/MessageCommand";

export default new Command({
    name: 'submit',
    aliases: ['request', 'post'],
    description: 'Post a commission request to krunker gfx lounge',
    cooldown: 5,
    guildOnly: false,
    required: [],
    execute: async function (message, args, bot: bot) {


        if (bot.queue.has(message.author.id)) {
            return message.replyEmbed({
                description: 'You already have a ticket open in DMs, please proceed to the existing one',
                color: 'RED'
            })
        }

        bot.queue.set(message.author.id, 1);


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

            if (!msg) {
                bot.queue.delete(message.author.id);
                return;
            }

            if (i == 0) {
                await message.replyEmbed({
                    description: ':mailbox_with_mail: you have received a mail'
                })
            }

            const res = await messageCollector(msg, filter, 120000);

            if (!res) {
                msg.sendEmbed({
                    description: 'Request timed out, please try again',
                    color: 'RED'
                });
                bot.queue.delete(message.author.id);
                return;
            }

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

        const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 30000 });
        collector.on('collect', async i => {
            if (message.handleInteraction(i)) return;
            bot.queue.delete(message.author.id);
            await msg.delete().catch(console.error);

            if (i.customId === 'finish') finalize(embed);
            else if (i.customId === 'discard') await msg.sendEmbed({
                color: 'GREEN',
                description: 'Successfully discarded request template'
            });
            else if (i.customId === 'edit') {
                await (self as Command).execute(message, args, bot);
            }

            collector.stop();
        });

        collector.on('end', async (i, reason) => {
            if (i.size == 0) (msg as Message).disableComponents()
            if (msg.deletable)
                await msg.delete().catch(console.error);

            if (reason == 'time') {
                bot.queue.delete(message.author.id);
                msg.sendEmbed({
                    color: 'RED',
                    description: 'Request timed out, please try again'
                });
            }
        });


        async function finalize(embed: MessageEmbed) {
            const btns = [
                new MessageButton().setStyle('SUCCESS').setLabel('Mark As Ongoing').setCustomId(`f_${BtnTypes.OPEN}_${message.author.id}`)
            ];

            embed.setFooter({ text: `Status: ${status[BtnTypes.OPEN]} Open` });

            const channel = message.guild.channels.cache.find(x => x.name.toLowerCase() == 'design-request');
            if (!channel) return;

            // @ts-ignore
            const req = await channel.send({ embeds: [embed], components: [new MessageActionRow().addComponents(...btns)] });

            await message.sendEmbedDM({
                description: `Successfully posted request in ${Formatters.hyperlink('Request', req.url)}`
            })
        }
    }
})
