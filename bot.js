var Discord = require('discord.io');
var logger = require('winston');
var auth = require('.././auth.json');

import { Game } from './game.js';
import { Player } from './player.js';
import { PlayerHolder } from './playerHolder.js';

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
        args.splice(0, 1);
        var argStr = args.join((' '));

        switch(cmd) {
            // !ping
            case 'sup':
                bot.sendMessage({
                    to: channelID,
                    message: 'What is up, my dude. I am ChadBot, the big dog of this server. Type "!commands" to find out what I can do.'
                });
            break;
            case 'chad':
                bot.sendMessage({
                    to: channelID,
                    message: "CHAD DETECTED! <@" + userID + "> is a chad!"
                });
            break;
            case 'echo':
                bot.sendMessage({
                    to: channelID,
                    message: argStr
                });
            break;
            case 'newgame':
                if(typeof(newgame)=="undefined" || newgame.gameStatus == 0){
                    makeGame(argStr, userID, user, channelID);
                }
                else{
                    bot.sendMessage({
                        to: channelID,
                        message: "Cannot create game while existing game is already in progress."
                    });
                }
            break;
            case 'addme':
                if(typeof(newgame)=="undefined" || newgame.gameStatus == 0){
                    bot.sendMessage({
                        to: channelID,
                        message: "ERROR: No current game for player to join."
                    });
                }
                else if(newgame.gameStatus == 1){
                    bot.sendMessage({
                        to: channelID,
                        message: "Game is full, player cannot be added."
                    });
                }
                else{
                    addPlayer(userID, user, channelID);
                }   
            break;
            case 'addbots':
                setTimeout(function(){addPlayer(123, "Bot1", channelID)}, 1000);
                setTimeout(function(){addPlayer(456, "Bot2", channelID)}, 2000);
                setTimeout(function(){addPlayer(789, "Bot3", channelID)}, 3000);
                setTimeout(function(){addPlayer(666, "Bot4", channelID)}, 4000);
                setTimeout(function(){addPlayer(8, "Bot5", channelID)}, 6000);
                setTimeout(function(){addPlayer(110, "Bot6", channelID)}, 7000);
            break;
            /*case 'vote':
                voteHandler(userID, argStr);
            break;
            case 'showvotes':
                voteList();
            break;*/
            
            case 'commands':
                bot.sendMessage({
                    to: channelID,
                    message: "```!sup = Get a welcome message.\n!echo = Have ChadBot repeat what you just said.\n!chad = Activate ChadBot's Chad Radar/\n!newgame <insert game type here> = Create a new game of mafia.\n!addme = Add yourself to the current mafia game.\n!vote <Player> = Vote to lynch a player.\n!showvotes = Show the number of votes on each player.\n!kill <Player> = Vote to kill the player (Mafia only; Do not use @ tag for this command).\n!investigate <Player> = Reveal the selected player's alignment (Detective only; Do not use @ tag for this command).\n!heal <Player> = Heal the selected player (Doctor only; Do not use @ tag for this command).```"
                });
            break;
            default:
                if(newgame.status == 1){
                    switch(cmd){
                        case 'vote':
                            if(newgame.time === "DAY"){
                                voteHandler(userID, argStr);
                            }
                            else{
                                genericPrintInt(channelID, "You cannot perform this action at night time.");
                            }
                        break;
                        case 'showvotes':
                            if(newgame.time === "DAY"){
                                voteList();
                            }
                            else{
                                genericPrintInt(channelID, "You cannot perform this action at night time.");
                            }
                        break;
                        case 'kill':
                            if(newgame.time==="NIGHT"){
                                console.log("Killing " + argStr);
                                //var subj = idParse(args[1]);
                                newgame.addAction("Mafioso", userID, argStr, 2); //GOES FIRST
                            }
                            else{
                                wrongPerms(channelID);
                            }
                        break;
                        case 'investigate':
                            if(newgame.time==="NIGHT"){
                                console.log("Investigating " + argStr);
                                //var subj = idParse(args[1]);
                                newgame.addAction("Detective", userID, argStr, 3);
                            }
                            else{
                                wrongPerms(channelID);
                            }
                        break;
                        case 'heal':
                            if(newgame.time==="NIGHT"){
                                console.log("Healing " + argStr);
                                //var subj = idParse(args[1]);
                                newgame.addAction("Doctor", userID, argStr, 1);
                            }
                            else{
                                wrongPerms(channelID);
                            }
                        break;
                    }
                }
            break;
        }
     }
});

function wrongPerms(cha){
    bot.sendMessage({
        to: cha,
        message: "You do not have permission to perform this action during the day!"
    });
}

function makeGame(mode, entry, user, channelID){
    newgame = new Game(mode, entry, user, channelID);
    gameChannel = channelID;
    bot.sendMessage({
        to: channelID,
        message: 'Game mode: ' + newgame.mode
    });
    printPlayerList(channelID);
}

function addPlayer(userID, user, channelID){
    var exists = 0;
    var i = 0;
    for(i; i<newgame.playerIDs.length; i++){
        if(newgame.playerIDs[i].ID == userID){
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
        newgame.playerIDs.push(new PlayerHolder(userID, user));
    }
    printPlayerList(channelID);
    if(newgame.playerIDs.length == newgame.numberOfPlayers){
        setTimeout(function(){
            bot.sendMessage({
                to: channelID,
                message: "Game Starting!"
            });
        }, 1000);
        newgame.startGame();
        giveRoles();
    }
}

function genPlayerList(){
    var outie = "Current players: <@" + newgame.players[0].ID + ">";
    var i;
    for(i=1; i<newgame.players.length; i++){
        outie += ", <@" + newgame.players[i].ID + ">";
    }
    return outie;
}

function printPlayerList(channelID){
    var outie = "Current players: <@" + newgame.playerIDs[0].ID + ">";
    var i;
    for(i=1; i<newgame.playerIDs.length; i++){
        outie += ", <@" + newgame.playerIDs[i].ID + ">";
    }
    bot.sendMessage({
        to: channelID,
        message: outie + ' (' + newgame.playerIDs.length + "/" + newgame.numberOfPlayers + ")"
    });
}

function giveRoles(){
    var i;
    var maf = [];
    var maflist = "The Mafia for this game are:";
    for(i = 0; i < newgame.players.length; i++){
        bot.sendMessage({
            to: newgame.players[i].ID,
            message: "Your role for this game is " + newgame.players[i].role + "! Your alignment is with the " + newgame.players[i].align + "!"
        });
        if(newgame.players[i].align === "Mafia"){
            maf.push(i);
            maflist += ("\n<@" + newgame.players[i].ID + ">");
        }
    }
    for(i = 0; i < maf.length; i++){
        genericPrintInt(newgame.players[maf[i]].ID, maflist);
    }

}

function idParse(tag){
    var first = tag.split("<@");
    //console.log(first);
    var second = first[1].split(">");
    //console.log(second);
    return second[0];
}

function voteHandler(voteID, votetag){
    function getPlayer(mp){
        return mp.ID === voteID;
    }
    var voter = newgame.players.find(getPlayer);
    if (voter.vote!=0){
        voteID = voter.vote;
        var unvote = newgame.players.find(getPlayer);
        unvote.votes--;                                   
    }
    voteID = idParse(votetag);
    voter.vote = voteID;
    var votedPlayer = newgame.players.find(getPlayer);
    if(typeof(votedPlayer)=="undefined"){
        bot.sendMessage({
            to: gameChannel,
            message: "Your vote was for a player not currently in the game!"
        });
    }
    else{
        votedPlayer.votes++;
        bot.sendMessage({
            to: gameChannel,
            message: "<@" + voter.ID + "> has voted for <@" + votedPlayer.ID +  ">! Number of votes on <@" + votedPlayer.ID +  ">: " + votedPlayer.votes
        });
        if(votedPlayer.votes >= newgame.voteThreshhold){
            bot.sendMessage({
                to: gameChannel,
                message: "<@" + votedPlayer.ID +  "> now exceeds the number of votes needed for a lynch, and will be lynched!\n<@" + votedPlayer.ID + "> is brought into the centre of the town square. As they are executed by their fellow citizens, their role was revealed to be..."
            });
            setTimeout(function(){
                bot.sendMessage({
                    to: gameChannel,
                    message: votedPlayer.role + "!"
                });
            }, 2000);
            newgame.lynch(voteID);
            //setTimeout(nightMessage, 5000);
        }
    }
}

function voteList(){
    var outie = "";
    outie += "Votes needed to lynch: " + newgame.voteThreshhold;
    //Sort algo for votes
    var i;
    var j;
    var tmpArray = newgame.players;
    for(i = 0; i < (tmpArray.length - 1); i++){
        while(!tmpArray[i].votes){
            //console.log("Current ID iter: " + tmpArray[i].ID + ", " + tmpArray[i].votes);
            tmpArray.splice(i, 1);
            if(i >= tmpArray.length){break;}
        }
        for(j = 1; j < tmpArray.length; j++){
            if(tmpArray[j].votes > tmpArray[i].votes){
                var swap = tmpArray[j];
                tmpArray[j] = tmpArray[i];
                tmpArray[i] = swap;
            }
        }
    }
    console.log(j); //TEST TO SEE CAN I MAKE THIS A BIT QUICKER BY GETTING RID OF CUT
    if(tmpArray.length > 0){
        var cut = (tmpArray.length - 1);
        if(tmpArray[cut].votes == 0){
            tmpArray.splice(cut, 1);
        }
    }
    for(i = 0; i < tmpArray.length; i++){
        outie += "\n<@" + tmpArray[i].ID +">: " + tmpArray[i].votes + " (";
        for(j = 0; j < newgame.players.length; j++){
            //if(tmpArray[i].ID != newgame.players[j].ID){
                if(tmpArray[i].ID == newgame.players[j].vote){
                    outie += "<@" + newgame.players[j].ID + ">, ";
                }
            //}
        }
        outie += ")";
    }
    bot.sendMessage({
        to: gameChannel,
        message: outie
    });
}

function nightMessage(){
    var playerStr = genPlayerList();
    bot.sendMessage({
        to: newgame.gameChannel,
        message: "Night " + newgame.daycount + " begins!\n" + playerStr
    });
    newgame.startNight();
}

exports.nightMessageEx = function(){
    nightMessage();
}

exports.introMessage = function(cha){
    console.log("sending intro message, " + cha);
    bot.sendMessage({
        to: cha,
        message: "Hello and welcome to Chadville! The citizens of the town have enjoyed a peaceful life, however in the darkness evil begins to stir as a local group of hooligans set out to take over the village..."
    });
}

exports.dayMessage = function(cha, day){
    //console.log("sending day message, " + cha);
    var playerStr = genPlayerList();
    setTimeout(function(){
        bot.sendMessage({
            to: cha,
            message: "Day " + day + " begins!\n" + playerStr
        });
    }, 1000);
    newgame.startDay();
}

exports.noLynchMessage = function(cha, status){
    console.log(newgame.lynchstat + " is our current lynchstat");
    if(!newgame.lynchstat){
        bot.sendMessage({
            to: newgame.gameChannel,
            message: "DAY IS OVER! No consensus for a lynch was reached today!"
        });
        nightMessage();
    }
    else{
        console.log("hell yeah we lynched");
    }
}

exports.actionCaller = function(){
    newgame.actionResolve();
}

function genericPrintInt(cha, strIn){
    bot.sendMessage({
        to: cha,
        message: strIn
    });
}

exports.genericPrint = function(cha, strIn){
    genericPrintInt(cha, strIn);
}

/*exports.getUser = function(useID){
    var thisUser = bot.users.get("id", useID);
    return thisUser.username;
}*/