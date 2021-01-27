module.exports = {
    name: 'clear',
    description: 'Clears messages',

    async run (client, message, args) {
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('You don\'t have the perms there laddy.')
        const amount = args.join(" ");
        if(!amount) return message.reply('how many messages you wanna clear?')

        if(amount > 100) return message.reply('Nah huh, 100+ is the max')

        if(amount < 1) return message.reply('need to clear at least 1 you idiot.')

        await message.channel.messages.fetch({limit: amount}).then(messages => {
            message.channel.bulkDelete(messages
        )});
        message.channel.send(`Cleared ${amount} messages....`);
    }

}