import { Message, MessageEmbed } from 'discord.js';


function init() {

    async function getMember(string) {
        const member = await this.guild.members.fetch(string.replace(/\D/g, '')).catch(() => { });
        return member ? member : null;
    };

    async function getUser(string) {
        const user = await this.client.users.fetch(string.replace(/\D/g, '')).catch(() => { });
        return user ? user : null;
    };


    function disableComponents() {
        const newRows = this.components.map(row => {
            row.components = row.components.map(component => component?.setDisabled(true));
            return row;
        });
        return this.edit({ components: newRows });
    };

    function createEmbed({ user, description, color, footer, fields }) {
        const embed = new MessageEmbed()
            .setDescription(description)
            .setColor(color ? color : 'GOLD');

        if (fields) {
            for (let i = 0; i < fields.length; i++)
                embed.addField(fields[i][0], fields[i][1], fields[i][2] ? true : false);
        }
        if (footer) embed.setFooter({ text: footer });
        if (user) embed.setAuthor({ name: user.username, iconURL: user.avatarURL() });
        return embed;
    };

    async function sendEmbedDM({ user, description, color, footer, fields }) {
        let msg = null;
        const embed = new MessageEmbed()
            .setDescription(String(description))
            .setColor(color ? color : 'GOLD');

        if (fields) {
            for (let i = 0; i < fields.length; i++)
                embed.addField(fields[i][0], fields[i][1], fields[i][2] ? true : false);
        }
        if (footer) embed.setFooter({ text: footer });
        if (user) embed.setAuthor({ name: user.username, iconURL: user.avatarURL() });
        try {
            msg = await (this as Message).author.send({ embeds: [embed] });
        } catch(e) {
            console.log('error, handling: ' + e);
            this.replyEmbed({ description: 'Unable to send DMs, please open your DMs and try again', color: 'RED' });
            return null;
        }

        return msg;
    }

    async function sendEmbed({ user, description, color, footer, fields }) {
        const embed = new MessageEmbed()
            .setDescription(String(description))
            .setColor(color ? color : 'GOLD');

        if (fields) {
            for (let i = 0; i < fields.length; i++)
                embed.addField(fields[i][0], fields[i][1], fields[i][2] ? true : false);
        }
        if (footer) embed.setFooter({ text: footer });
        if (user) embed.setAuthor({ name: user.username, iconURL: user.avatarURL() });
        return await this.channel.send({ embeds: [embed], failIfNotExists: false }).catch(console.error);
    };

    async function replyEmbed({ user, description, color, footer, fields }) {
        const embed = new MessageEmbed()
            .setDescription(String(description))
            .setColor(color ? color : 'GOLD');

        if (fields) {
            for (let i = 0; i < fields.length; i++)
                embed.addField(fields[i][0], fields[i][1], fields[i][2] ? true : false);
        }

        if (footer) embed.setFooter({ text: footer });
        if (user) embed.setAuthor({ name: user.username, iconURL: user.avatarURL() });
        return await this.reply({ embeds: [embed], failIfNotExists: false }).catch(console.error);
    };

    function handleInteraction(i, author?: string) {
        const user = author ? author : this.author.id;
        if (i.user.id !== user) {
            i.reply({
                content: `You can't use the controls of a command issued by another user!\n Current Command issued by: <@${user}>`,
                ephemeral: true
            });
            return true;
        }
    }

    const meta = [sendEmbedDM, sendEmbed, replyEmbed, getUser, getMember, disableComponents, createEmbed, handleInteraction];

    for (const data of meta) {
        Message.prototype[data.name] = data;
    }

}

export default init;
