const { MessageEmbed } =  require('discord.js');
module.exports = {
    name: 'ping',
    description: 'Just pings the server via bot side',

    async run (client, message, args) {
        const ping = new MessageEmbed()
        .setDescription(`${Date.now() - message.createdTimestamp} ms`);

        message.channel.send(ping);
    }
}