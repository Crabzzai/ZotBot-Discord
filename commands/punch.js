// Imports
const Discord = require('discord.js');
const axios = require('axios');

// Local variables
var gifs = {};

// Command export
module.exports = () => {
    var moduleData = {};

    moduleData.name = 'punch';
    moduleData.description = 'Punch those nasty weirdos.';

    moduleData.options = [
        {
            name: 'user',
            description: 'The user to punch.',
            type: 6,
            required: true
        }
    ];

    moduleData.execute = (bot, dataStream, args) => {
        var respond = require('../respond.js')(bot, dataStream);
        try {
            // Tenor API Configuration
            var lmt = 30,
                search_queue = 'punch',
                search_url = `https://api.tenor.com/v1/search?q=${search_queue}&limit=${lmt}`;

            axios.get(search_url)
                .then(async (res) => {
                    if (!gifs.lastCache || new Date().getTime() - gifs.lastCache < (30 * 60 * 1000)) {
                        gifs.lastCache = await new Date().getTime();
                        gifs.cache = await res.data.results;
                    }
                    var randIndex = Math.floor(Math.random() * gifs.cache.length),
                        gif = gifs.cache[randIndex].media[0].gif.url;
                    bot.users.fetch(args[0].value).then(async (user) => {
                        try {
                            const embed = new Discord.MessageEmbed()
                                .setTitle(`${dataStream.user.username} punched ${user.username}! Right in the face ;o`)
                                .setColor('#920f00')
                                .setImage(gif)
                                .setTimestamp(new Date());
                            respond.post({
                                data: {
                                    type: 4,
                                    data: {
                                        embeds: [embed]
                                    }
                                }
                            });
                        } catch(err) {
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
                    }).catch((err) => {
                        console.error(err);
                        respond.post({
                            data: {
                                type: 4,
                                data: {
                                    content: `Something went wrong, please try again later!`
                                }
                            }
                        });
                    });
                }).catch((err) => {
                    console.error(err);
                    respond.post({
                        data: {
                            type: 4,
                            data: {
                                content: `Something went wrong, please try again later!`
                            }
                        }
                    });
                });
        } catch(err) {
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
};