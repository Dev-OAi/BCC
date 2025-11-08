module.exports = async () => {
    if (global.server) {
        await new Promise(resolve => global.server.close(resolve));
    }
};
