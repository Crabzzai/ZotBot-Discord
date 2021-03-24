// Imports
const Discord = require('discord.js');

// Module export
module.exports = () => {
    var moduleData = {};

    moduleData.name = 'bal';
    moduleData.description = 'Check your balance.';

    moduleData.options = [];

    moduleData.execute = async (bot, dataStream, args) => {
        var respond = require('../respond.js')(bot, dataStream);
        try {
            if (!db) return respond.post({
                data: {
                    type: 4,
                    data: {
                        content: `I'm not connected to any database, please contact my administrator if you think this is an error.`
                    }
                }
            });
            var res = await db.economy.findOne({guild: dataStream.guild.id, user: dataStream.user.id});
            if (!res || res == {}) {
                db.economy.createOne({
                    guild: dataStream.guild.id,
                    user: dataStream.user.id,
                    balance: 0
                }, (err, result) => {
                    if (err) throw err;
                    console.log(result);
                });
            } else {
                // Code
            }
        } catch (err) {
            console.error(err);
            respond.post({
                data: {
                    type: 4,
                    data: {
                        content: `Something went wrong, please try again later!`
                    }
                }
            });
        }
    };

    return moduleData;
}