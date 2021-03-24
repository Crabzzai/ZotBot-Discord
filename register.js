// Imports
const Discord = require('discord.js');
const fs = require('fs');

// Local imports
const config = require('./config.json');

// Discord Bot
const bot = new Discord.Client();

// Find command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Fires when bot is ready
bot.on('ready', async () => {
    console.log(`Logged in as ${bot.user.username}`);

    // Add commands
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`)();
        await bot.api.applications(bot.user.id).guilds(config.guild_id).commands.post({data: {
            name: command.name,
            description: command.description,
            options: command.options
        }}).then(async res => {
            await console.log(`${file} was loaded.`);
        }).catch(err => {
            console.log(err);
        });
    }
    await console.log('All commands loaded!');
    await bot.destroy();
});

bot.login(config.token);