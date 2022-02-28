import SlashCommand from "../../../../modules/Commands/SlashCommand";

export default new SlashCommand({
    name: 'slashtest',
    description: 'lul e',
    execute: async(i) => {
        i.reply('lmao no');
    }
})