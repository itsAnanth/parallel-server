import type { Event as IEvent, EventPayload } from '../shared/types/Event';

interface Event extends IEvent { };

class Event {
    constructor(options: EventPayload) {
        this.name = options.name;

        this.execute = options.execute;
    }
}


export default Event;