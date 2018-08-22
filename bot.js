var Discord = require('discord.io');
var logger = require('winston');
var auth = require('.././auth.json');

import { Game } from './game.js';
import { Player } from './player.js';

var newgame;
var gameChannel;

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
            break;
            case 'addme':
                //addPlayer(userID, channelID); - ACTUAL CODE, PLEASE INCLUDE
                setTimeout(function(){addPlayer(123, channelID)}, 1000);
                setTimeout(function(){addPlayer(456, channelID)}, 2000);
                setTimeout(function(){addPlayer(789, channelID)}, 3000);
                setTimeout(function(){addPlayer(666, channelID)}, 4000);
                setTimeout(function(){addPlayer(8, channelID)}, 6000);
                setTimeout(function(){addPlayer(110, channelID)}, 7000);    
            break;
        }
     }
});



function makeGame(mode, entry, channelID){
    newgame = new Game(mode, entry, channelID);
    gameChannel = channelID;
    bot.sendMessage({
        to: channelID,
        message: 'Game mode: ' + newgame.mode
    });
    printPlayerList(channelID);
}

function addPlayer(userID, channelID){
    var exists = 0;
    var i = 0;
    for(i; i<newgame.playerIDs.length; i++){
        if(newgame.playerIDs[i] == userID){
            exists = 1;
        }
    }
    if(exists){
        bot.sendMessage({
            to: channelID,
            message: "Player is already entered into the game!"
        });
    }
    else{
        newgame.playerIDs.push(userID);
    }
    printPlayerList(channelID);
    if(newgame.playerIDs.length == newgame.numberOfPlayers){
        bot.sendMessage({
            to: channelID,
            message: "Game Starting!"
        });
        newgame.startGame();
        giveRoles();
    }
}

function printPlayerList(channelID){
    var outie = "Current players: <@" + newgame.playerIDs[0] + ">";
    var i;
    for(i=1; i<newgame.playerIDs.length; i++){
        outie += ", <@" + newgame.playerIDs[i] + ">";
    }
    bot.sendMessage({
        to: channelID,
        message: outie + ' (' + newgame.playerIDs.length + "/" + newgame.numberOfPlayers + ")"
    });
}

function giveRoles(){
    var i;
    for(i = 0; i < newgame.players.length; i++){
        bot.sendMessage({
            to: newgame.players[i].ID,
            message: "Your role for this game is " + newgame.players[i].role + "! Your alignment is with the " + newgame.players[i].align + "!"
        });
    }
}

exports.intro = function(cha){
    console.log("Well it makes it here; " + cha);
    setTimeout(function(){
        bot.sendMessage({
            to: cha,
            message: "WE IN THIS GAME BITCHES WOOOOOOOOOOO"
        });
    }, 1000);
}