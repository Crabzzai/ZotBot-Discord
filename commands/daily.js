// Imports
const Discord = require('discord.js');
const moment = require('moment');

// Module export
module.exports = () => {
    var moduleData = {};

    moduleData.name = 'daily';
    moduleData.description = 'Get your daily amount of shillings.';

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
                var lastDaily = new Date().getTime() - res.lastDaily;
                var diff = new moment.duration(lastDaily);
                if (diff.asHours() < 24) {
                    var missing = new moment.duration((1000 * 60 * 60 * 24) - lastDaily);
                    return respond.post({
                        data: {
                            type: 4,
                            data: {
                                content: `You'll need to wait ${missing.asHours()} hours, to claim a new daily amount.`
                            }
                        }
                    });
                }
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