import natural from 'natural';
import tensorflow from '@tensorflow/tfjs';
import nodeTensor from '@tensorflow/tfjs-node';
import EventEmitter from 'events';
import Language from '../types/ML';
import type { Agent as IAgent } from '../types/ML';

interface Agent extends IAgent { };

class Agent extends EventEmitter {
    constructor(language: Language) {
        super();

        this.tokenizer = null;
        this.words = [];
        this.classes = [];
        this.documents = [];
        this.ignore_words = ["?"];
        this.training = new Array();
        this.context = [];
        this.intents = [];
        this.synonyms = [];

        this.model = null;

        this._configTokenizer(language);
    }

    _configTokenizer(language: Language) {
        if (language == Language.ENGLISH) {
            natural.LancasterStemmer.attach();
            this.tokenizer = new natural.WordPunctTokenizer();
        }
    }
}