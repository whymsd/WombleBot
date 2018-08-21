var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
import { Game } from './game.js';

//var game = require('./game.js');

/*class game{

    constructor(){
        this.numberOfPlayers = 7;
    }
}*/

var newgame = new Game();

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
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'sup':
                bot.sendMessage({
                    to: channelID,
                    message: 'welcome my dude'
                });
            break;
            case 'chad':
                bot.sendMessage({
                    to: channelID,
                    message: '' + user + ' is a chad'
                });
            break;
            case 'new-game':
                //this.newgame = new game();
                bot.sendMessage({
                    to: channelID,
                    message: 'Game created!'
                });
            break;
            // Just add any case commands if you want to..
         }
     }
});