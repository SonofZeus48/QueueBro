const fs = require(`fs`);
const Discord = require('discord.js');
const { prefix, token, creator, version } = require('./config.json');
const tink = require('./commands/tink');
const { time } = require('console');
const { aliases } = require('./commands/avatars');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

const str = 'abc\ndef';

bot.on('ready', () =>{ 
    console.log(`bot's up and running`);
});

bot.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = bot.commands.get(commandName)

        || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    
    if (command.guildOnly && message.channel.type === 'dm') { 
        return message.reply('I can\'t execute that command in dms bro.')
    }
    if (command.args && !args.length) {
        
        let reply = `you didn't provide any args, ${message.author}.`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        
        return message.channel.send(reply);
    }
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }
        
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
        
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \'${command.name}\' command.`)
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
    try {
        command.execute(message, args);
    } catch (error) { 
        console.error(error);
        message.reply('There was an error trying to execute that bro.');
    }
});

bot.login(token);