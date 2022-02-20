import Command from "../../../../modules/Command";

export default new Command({
    name: 'test',
    execute: async(message) => {
        message.channel.send('test');
    }
})