import Server from './modules/Server';
import { config } from 'dotenv';

config();

const server = new Server();

(async function () {
    await server.__init__();

    server.start();
})();