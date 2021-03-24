// Imports
const Discord = require('discord.js');
const fs = require('fs');

// Local imports
const config = require('./config.json');
const database = require('./database.js');

// Setting up the discord bot
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

if (config.database.conf.username.replaceAll(' ', '') != '' || config.database.conf.password.replaceAll(' ', '') != '' || config.database.conf.ip.replaceAll(' ', '') != '' || config.database.conf.port.replaceAll(' ', '') != '') {
    // Connecting to MongoDB database
    database(`mongodb://${config.database.conf.username}:${config.database.conf.password}@${config.database.conf.ip}:${config.database.conf.port}/admin?retryWrites=true`, (err, client) => {
        if (err) {
            console.log('Database was not connected.\nIf this is an error please check your configuration again.');
            console.error(err);
        }

        db = {
            economy: client.db(config.database.name).collection('economy'),
            settings: client.db(config.database.name).collection('settings')
        };

        console.log('Connected to MongoDB database.');
    });
} else {
    console.log('Database was not connected.\nIf this is an error please check your configuration again.');
}

// Fires when bot is ready
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.username}`);
});

// Declaire command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith(".js"));

// Adding command files to object of commands
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)();
    bot.commands.set(command.name, command);
}

// Slash commands executer
bot.ws.on("INTERACTION_CREATE", async act => {
    var member = act.member,
        cmd = act.data.name,
        args = act.data.options,
        guild = await bot.guilds.fetch(await act.guild_id),
        channel = await guild.channels.cache.find(channel => channel.id === act.channel_id),
        id = act.id,
        token = act.token,
        command = await bot.commands.get(cmd);
    
    if (command) {
        command.execute(bot, {
            channel: channel,
            guild: guild,
            user: member.user,
            member: member,
            id: id,
            token: token
        }, args);
    } else {
        var respond = require('./respond.js')(bot, {
            id: id,
            token: token
        });

        respond.post({
            data: {
                type: 4,
                data: {
                    content: `Something went wrong, please try again later!`
                }
            }
        });
    }
});

// Login to the discord bot
bot.login(config.token);