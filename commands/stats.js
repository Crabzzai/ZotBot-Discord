// Imports
const Discord = require('discord.js');

// Module export
module.exports = () => {
    var moduleData = {};

    moduleData.name = 'stats';
    moduleData.descriptions = 'Get server stats.';

    moduleData.execute = async (bot, dataStream, args) => {
        var respond = require('../respond.js')(bot, dataStream);
        try {
            var guild = dataStream.guild,
                icon = guild.icon,
                id = guild.id,
                maximumMembers = guild.maximumMembers,
                memberCount = guild.memberCount,
                name = guild.name,
                owner = guild.owner
                boosts = guild.premiumSubscriptionCount,
                premiumTier = guild.premiumTier
                roles = guild.roles;

            var embed = new Discord.MessageEmbed()
                .setTitle(`${name} <-> ID: ${id}`)
                .setDescription(`Catch these informations!`)
                .addFields([
                    {name: `Owner`, value: `${owner.user.username}#${owner.user.discriminator}`, inline: true},
                    {name: `Members`, value: `${memberCount} Users`, inline: true},
                    {name: `Maximum Members`, value: `${maximumMembers} Users`, inline: true},
                    {name: `Server Boosts`, value: `${boosts} Boosts`, inline: true},
                    {name: `Nitro Perks`, value: `Level ${premiumTier}`, inline: true},
                    {name: `Roles`, value: `${roles}`, inline: false},
                ])
                .setThumbnail(`${icon}`)
                .setColor('#f0cc4a')
                .setTimestamp(new Date());

            respond.post({
                data: {
                    type: 4,
                    data: {
                        embeds: [embed]
                    }
                }
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