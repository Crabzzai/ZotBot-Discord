// imports
const Discord = require('discord.js');

// Module export
module.exports = () => {
    var moduleData = {};

    moduleData.name = 'kick';
    moduleData.description = 'Kick this member from the guild';

    moduleData.options = [
        {
            name: 'user',
            description: 'The user to kick.',
            type: 6,
            required: true
        },
        {
            name: 'reason',
            description: 'Reason for kicking user.',
            type: 3,
            required: false
        }
    ];

    moduleData.execute = (bot, dataStream, args) => {
        var respond = require('../respond.js')(bot, dataStream);
        try {
            if (!dataStream.member.hasPermission('KICK_MEMBERS')) return respond.post({
                data: {
                    type: 4,
                    data: {
                        content: `You aren't allowed to use this command!`
                    }
                }
            });

            bot.users.fetch(args[0].value).then(async (user) => {
                try {
                    var member = dataStream.guild.members.resolve(user.id);
                    if (member.hasPermission('MANAGE_MESSAGES') || dataStream.member.roles.highest.comparePositionTo(member.roles.highest) < 0) return respond.post({
                        data: {
                            type: 4,
                            data: {
                                content: `I'm not allowed to kick this user.`
                            }
                        }
                    });
                    var reason = args[1] ? args[1].value : 'They deserved it.';

                    const guildEmbed = new Discord.MessageEmbed()
                        .setAuthor(`${user.username}#${user.discriminator} was kicked.`)
                        .addFields([
                            {name: 'Moderator', value: `${dataStream.user.username}#${dataStream.user.discriminator}`, inline: true},
                            {name: 'Reason', value: `${reason}`, inline: true}
                        ])
                        .setColor('#FFCC00')
                        .setTimestamp(new Date());
                    const userEmbed = new Discord.MessageEmbed()
                        .setAuthor(`You was kicked from ${dataStream.guild.name}`)
                        .addFields([
                            {name: 'Moderator', value: `${dataStream.user.username}#${dataStream.user.discriminator}`, inline: true},
                            {name: 'Reason', value: `${reason}`, inline: true}
                        ])
                        .setColor('#FFCC00')
                        .setTimestamp(new Date());
                    
                    await member.createDM().then(DMChannel => {
                        DMChannel.send(userEmbed);
                    }).then(() => {
                        member.kick(reason).then(() => {
                            respond.post({
                                data: {
                                    type: 4,
                                    data: {
                                        embeds: [guildEmbed]
                                    }
                                }
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
                    });
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