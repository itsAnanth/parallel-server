import { Dyno as IDyno, DynoPayload } from '../shared/types/Dyno';

interface Dyno extends IDyno { };

class Dyno {
    constructor(options: DynoPayload) {
        this.run = options.run;
    }
}

export default Dyno;
