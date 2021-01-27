require('dotenv').config();
const { Discord, Client, Collection, } = require('discord.js');
const client = new Client();

const token = process.env.token

const { readdirSync } = require('fs');
const { join } = require('path');

client.commands = new Collection();
const prefix = '.';

const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(join(__dirname, 'commands', `${file}`));
    client.commands.set(command.name, command)
};

//discord stats

let stats = {
    serverID: '656049566046748694',
    total: "746039413905293313",
    member: "746039478891708456",
    bots: "746039549943218188"
};

client.on('guildMemberAdd', member => {
    if(member.guild.id !== stats.serverID) return;
    client.channels.cache.get(stats.total).setName(`Total Users: ${member.guild.memberCount}`);
    client.channels.cache.get(stats.member).setName(`Members: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
    client.channels.cache.get(stats.bots).setName(`Bots: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
});
client.on('guildMemberRemove', member => {
    if(member.guild.id !== stats.serverID) return;
    client.channels.cache.get(stats.total).setName(`Total Users: ${member.guild.memberCount}`);
    client.channels.cache.get(stats.member).setName(`Members: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
    client.channels.cache.get(stats.bots).setName(`Bots: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
});
client.on('error', console.error);

client.on('ready', () => {
    console.log('Discord is connected');
});

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);

    if(!prefixRegex.test(message.content)) return
    const[, matchedPrefix] = message.content.match(prefixRegex)
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);

        const command = args.shift().toLowerCase();
        if(!client.commands.has(command)) return;

        try{
            client.commands.get(command).run(client, message, args)
        } catch (error){
        console.log(error);
        }
    })

client.login(token);