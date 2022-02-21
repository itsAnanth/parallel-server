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

    function createEmbed({ user, description, color, footer }) {
        const embed = new MessageEmbed()
            .setDescription(description)
            .setColor(color ? color : 'GOLD');

        if (footer) embed.setFooter({ text: footer });
        if (user) embed.setAuthor({ name: user.username, iconURL: user.avatarURL() });
        return embed;
    };

    async function sendEmbed({ user, description, color, footer }) {
        const embed = new MessageEmbed()
            .setDescription(description)
            .setColor(color ? color : 'GOLD');

        if (footer) embed.setFooter({ text: footer });
        if (user) embed.setAuthor({ name: user.username, iconURL: user.avatarURL() });
        return await this.channel.send({ embeds: [embed], failIfNotExists: false }).catch(console.error);
    };

    async function replyEmbed({ user, description, color, footer }) {
        const embed = new MessageEmbed()
            .setDescription(description)
            .setColor(color ? color : 'GOLD');

        if (footer) embed.setFooter({ text: footer });
        if (user) embed.setAuthor({ name: user.username, iconURL: user.avatarURL() });
        return await this.reply({ embeds: [embed], failIfNotExists: false }).catch(console.error);
    };

    function handleInteraction(i) {
        if (i.user.id !== this.author.id) {
            i.reply({
                content: `You can't use the controls of a command issued by another user!\n Current Command issued by: <@${this.author.id}>`, 
                ephemeral: true
            });
            return true;
        }
    }

    const meta = [sendEmbed, replyEmbed, getUser, getMember, disableComponents, createEmbed, handleInteraction];

    for (const data of meta) {
        Message.prototype[data.name] = data;
    }

}

export default init;
