import Server from './modules/Server';
import { config } from 'dotenv';
import init from './modules/utils';

init();
config();

const server = new Server(['krunker_asia']);

(async function () {
    await server.__init__();

    await server.start();
})();