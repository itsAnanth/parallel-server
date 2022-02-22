import natural from 'natural';

enum Language {
    ENGLISH
}

interface Agent {
    tokenizer: natural.Tokenizer | null;
    words: any[];
    classes: any[];
    documents: any[];
    ignore_words: string[];
    training: any[];
    context: any[];
    intents: any[];
    synonyms: any[];
    model: any;
}

export default Language;
export type { Agent }