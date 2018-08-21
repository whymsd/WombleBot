var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

import { Game } from './game.js';

var newgame;
var myuser;

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

function makeGame(numberOfPlayers, entry, channelID){
    newgame = new Game(numberOfPlayers, entry);
    bot.sendMessage({
        to: channelID,
        message: 'Game created with ' + newgame.numberOfPlayers + ' players!'
    });
    bot.sendMessage({
        to: channelID,
        message: 'Current players: @' + newgame.players[0] + ''
    });
}

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        //var target = args[1];
       
        //args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'sup':
                bot.sendMessage({
                    to: channelID,
                    message: 'welcome my dude'
                });
            break;
            case 'chad':
                this.myuser = bot.users[userID];
                bot.sendMessage({
                    to: userID,
                    message: `CHAD DETECTED! <@${this.myuser.id}> is a chad!`
                });
            break;
            case 'new-game':
                makeGame(args[1], user, channelID);
                /*bot.sendMessage({
                    to: channelID,
                    message: 'Game created with ' + this.newgame.numberOfPlayers + ' players!'
                });*/
            break;
            // Just add any case commands if you want to..
         }
     }
});