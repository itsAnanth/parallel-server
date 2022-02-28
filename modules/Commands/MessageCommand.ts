import { Client, Formatters, Permissions } from 'discord.js';
import type { allowPayload, Command as ICommand, MessageCommand as IMC, MessageCommandPayload } from '../../shared/types/Command';
import type { Message as IMessage } from '../../shared/types/Message';
import Command from './Command';
import CommandTypes from './CommandTypes';

interface MessageCommand extends IMC { };

class MessageCommand extends Command {
    constructor(options: MessageCommandPayload) {
        super(options);
        this.execute = options.execute;
        this.type = CommandTypes.MESSAGE;
    }

    run(message: IMessage, args: string[], bot: Client) {
        if (this.dev && !this.checkIfDev(message)) return;
        if (this.required.length != 0 && !this.checkBotPermission(message)) {
            console.log(`At ${this.name}.ts missing permissions, required: ${this.required}`)
            return message.replyEmbed({
                description: `Missing Bot Permission(s) | ${Formatters.inlineCode(this.required.reduce((a, c) => new Permissions(c).toArray().concat(a), []).join(', ').trim())}`
            });
        }
        
        this.execute(message, args, bot);
    }
}

export default MessageCommand;

