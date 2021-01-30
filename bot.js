// Compiler rule to avoid JS pitfalls
'use strict'

// Discord / Client objects
const Discord = require('discord.js')
// MessageEmbed object
const {
    MessageEmbed
} = require('discord.js');
const Client = new Discord.Client();

// Configuration
require('./config')
require('dotenv').config()

Client.on('ready', () => {
    console.log('Ready to yell at pingers!')
})

Client.on('message', message => {
    // Debug message to show number of pings
    dbgMsg('Found ' + message.mentions.users.size + ' mentions');

    if (!message.mentions.users.size || message.author.bot) {
        // if no mentions OR the author is a bot end execution
        return
    } else {
        message.mentions.users.forEach(user => {
            if (Config.blacklist == user.id) {
                const embed = new MessageEmbed()
                    .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({
                        dynamic: true
                    }))
                    .setDescription(`Message sent by ${message.author} has been \`Deleted\` by <@712450623416565833>`)
                    .addField(`Reason:`, '\`Pinging Owner!\`')
                    .setColor('#e52030')
                Client.channels.cache.get(Config.reporting).send(embed)
                message.delete().catch(console.error)

                // Ping Embed DM
                const pingdm = new MessageEmbed()
                    .setAuthor(`Anti Ping | ${message.guild.name}`, `https://cdn.discordapp.com/icons/756182992304734251/a_72446774f59bb077e1b70b6ab9fd1312.webp?size=256`)
                    .setDescription(`You have received a warning for **Pinging Emilie**.`)
                    .addField('Rule Violated:', `\`Rule 1 -\` Do not directly use the \`@\` function to ping Emilie to get her attention, you can write her name in your messages but not ping her in channels.`)
                    .addField('Rule Violater:', `\`${message.author.tag}\``)
                    .setColor('#e52030')
                message.author.send(pingdm)


                //ping Embed Server
                const pingserver = new MessageEmbed()
                    .setAuthor(`Please do not ping Emilie, ${message.author.tag}`, `https://cdn.discordapp.com/emojis/804388367126626324.png?v=1`)
                    .setColor('#e52030')
                message.channel.send(pingserver).then(msg => msg.delete({
                    timeout: 15000
                })).catch(err => message.client.logger.error(err.stack));
            }
        })
    }
})

function logMsg(prefix, msg) {
    console.log(prefix + ": " + msg)
}

function dbgMsg(msg) {
    if (Config.debug) {
        console.log("DEBUG: " + msg)
    }
}

Client.login(process.env.CLIENT_TOKEN)