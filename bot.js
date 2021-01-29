// Compiler rule to avoid JS pitfalls
'use strict'

// Discord / Client objects
const Discord = require('discord.js')
const Client = new Discord.Client();

// Configuration
require('./config')
require('dotenv').config()

const Blacklist = [
    "150464992074792960", // Daixso
    "760902699381686272" // Pilot Emilie
]

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
            if (Blacklist.indexOf(user.id) > -1) {
                logMsg('Alert', '[' + message.author.id + ' | ' + message.author.username + ']: Pinged a blacklisted member.')
                message.delete().catch(console.error)
                message.channel.send(`${message.author} please avoid tagging ${user.username} per ${message.guild.channels.cache.get(Config.rules).toString()}. ${Config.message}`)
                Client.channels.cache.get(Config.reporting).send('[' + message.author.id + ' | ' + message.author.username + ']: Pinged a blacklisted member: ' + user.username)
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