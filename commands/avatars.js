module.exports = {
    name: 'avatar',
    aliases: ['icon', 'pfp'],
    cooldown: 3,
    description: `shows you avatars of people you ping`,
    execute(message, args) {
        if (!message.mentions.users.size){ 
            return message.channel.send(`Your pfp: <${message.author.displayAvatarURL({format: "png", dynamic: true})}>`);
        }
        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: <${user.displayAvatarURL({format: "png", dynamic: true })}>`;
        });

        message.channel.send(avatarList);
    },
};