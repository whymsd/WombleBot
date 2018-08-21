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
                bot.sendMessage({
                    to: channelID,
                    message: "CHAD DETECTED! <@" + userID + "> is a chad!"
                });
            break;
            case 'newgame':
                makeGame(args[1], userID, channelID);
                /*bot.sendMessage({
                    to: channelID,
                    message: 'Game created with ' + this.newgame.numberOfPlayers + ' players!'
                });*/
            break;
            case 'addme':
                addPlayer(userID, channelID);
                /*bot.sendMessage({
                    to: channelID,
                    message: `Current players: ${for} ` + '(' + newgame.players.length + "/" + newgame.numberOfPlayers + ")"
                });*/
                printPlayerList(channelID);    
            break;
        }
     }
});



function makeGame(mode, entry, channelID){
    newgame = new Game(mode, entry);
    bot.sendMessage({
        to: channelID,
        message: 'Game mode: ' + newgame.mode
    });
    printPlayerList(channelID);
}

function addPlayer(userID, channelID){
    var exists = 0;
    var i = 0;
    for(i; i<newgame.players.length; i++){
        if(newgame.players[i] = userID){
            exists = 1;
        }
    }
    if(!exists){
        newgame.players.push(userID);
    }
    else{
        bot.sendMessage({
            to: channelID,
            message: "Player is already entered into the game!"
        });
    }
}

function printPlayerList(channelID){
    var outie = "Current players: <@" + newgame.players[0] + ">";
    var i;
    for(i=1; i<newgame.players.length; i++){
        outie += ", <@" + newgame.players[i] + ">";
    }
    bot.sendMessage({
        to: channelID,
        message: outie + ' (' + newgame.players.length + "/" + newgame.numberOfPlayers + ")"
    });
}