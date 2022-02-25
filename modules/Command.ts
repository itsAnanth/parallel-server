import { Client, Formatters, Permissions } from 'discord.js';
import type { allowPayload, Command as ICommand, CommandPayload } from '../shared/types/Command';
import type { Message as IMessage } from '../shared/types/Message';
import devs from '../shared/data/devs.json';

interface Command extends ICommand { };

class Command {
    constructor(options: CommandPayload) {
        this.name = options.name;
        this.aliases = options.aliases ? options.aliases : [];
        this.description = options.description ? options.description : 'not provided';
        this.cooldown = options.cooldown ? options.cooldown : 0;
        this.expectedArgs = options.expectedArgs ? options.expectedArgs : 'not provided';
        this.dev = options.dev ? options.dev : false;
        this.execute = options.execute;

        this.configBotPermissions(options.required);
        this.configUserPermissions(options.allow);
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

    checkIfDev(message: IMessage) {
        return devs.includes(message.author.id);
    }

    checkBotPermission(message: IMessage) {
        for (let i = 0; i < this.required.length; i++) {
            if (!message.guild.me.permissions.has(this.required[i]))
                return false;
        }
        return true;
    }

    configBotPermissions(permissionArray: bigint[] | undefined) {
        this.required = permissionArray ? permissionArray : [];
    }

    configUserPermissions(permissionArray: allowPayload | undefined) {
        let permissions: ICommand["allow"];
        permissions = { permissions: [], roles: [], ids: [] };

        if (permissionArray) {
            permissionArray.permissions && (permissions.permissions = permissionArray.permissions);
            permissionArray.ids && (permissions.ids = permissionArray.ids);
            permissionArray.roles && (permissions.roles = permissionArray.roles);
        }

        this.allow = permissions;
    }
}

export default Command;

