import Command from "../../../../modules/Command";

export default new Command({
    name: 'test',
    cooldown: 5,
    execute: async(message) => {
        message.channel.send('test');
    }
})