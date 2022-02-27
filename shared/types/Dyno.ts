type DynoPayload = {
    run: (...args) => Promise<any>;
}

interface Dyno {
    run: DynoPayload['run'];
}

export type { Dyno, DynoPayload }