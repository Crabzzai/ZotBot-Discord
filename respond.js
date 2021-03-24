// Export module
module.exports = (bot, dataStream) => {
    return bot.api.interactions(dataStream.id, dataStream.token).callback;
}