import type { Message } from '../shared/types/Message';
import { CollectorFilter } from 'discord.js';

function messageCollector(message: Message, filter: CollectorFilter<[Message]>, time?: number, max?: number): Promise<Message | false> {
    const collectorPayload: { time?: number, max?: number, filter?: CollectorFilter<[Message]> } = {};
    if (time)
        collectorPayload.time = time;
    if (max)
        collectorPayload.max = max;
    if (filter)
        collectorPayload.filter = filter;
    const collector = message.channel.createMessageCollector(collectorPayload);

    return new Promise((resolve, reject) => {
        collector.on('collect', (recvMsg) => {
            resolve(recvMsg as Message);
        });

        collector.on('end', () => {
            resolve(false);
        })
    })
}

export default messageCollector;
