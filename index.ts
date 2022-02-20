import Server from './modules/Server';

const server = new Server();

(async function () {
    await server.__init__();

    server.start();
})();