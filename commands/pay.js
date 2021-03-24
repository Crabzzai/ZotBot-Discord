// Imports
const Discord = require('discord.js');

// Module export
module.exports = () => {
    var moduleData = {};

    moduleData.name = 'pay';
    moduleData.description = 'Send your friends some few shillings.';

    moduleData.options = [
        {
            name: 'user',
            description: 'The user to punch.',
            type: 6,
            required: true
        },
        {
            name: 'number',
            description: 'The amount of money you want to send.',
            type: 4,
            required: true
        }
    ];

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

            if (args <= 0) return respond.post({
                data: {
                    type: 4,
                    data: {
                        content: `I can't transfer a negative amount or zero money.`
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