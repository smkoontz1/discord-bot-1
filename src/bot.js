"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SpotifyApiService_1 = require("./services/spotify/SpotifyApiService");
const UserService_1 = require("./services/user/UserService");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const Discord = require('discord.js');
const client = new Discord.Client();
const spotifyApiService = new SpotifyApiService_1.SpotifyApiService();
const userService = new UserService_1.UserService();
client.on('ready', () => {
    client.user.setActivity('Use: ^boxcat');
    console.log(`Logged in as ${client.user.tag}`);
});
const LYRICS = "^lyrics";
client.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.author.tag !== client.user.tag) {
        let username = msg.author.username;
        if (userService.messageAllowedFrom(username)) {
            if (msg.content === '^boxcat') {
                msg.reply('```The current commands are:\n\n' +
                    '^ping\n' +
                    '^lyrics```');
            }
            if (msg.content === '^ping') {
                msg.reply('pong');
            }
            if (msg.content.startsWith(LYRICS)) {
                const lyricArgs = msg.content.slice(LYRICS.length).trim();
                if (lyricArgs === '') {
                    msg.reply('Please add lyric arguments.');
                }
                else {
                    try {
                        let spotifyUrl = yield spotifyApiService.getSongMatchSpotifyUrlAsync(lyricArgs);
                        msg.reply("Is this your song?\n" + spotifyUrl);
                    }
                    catch (error) {
                        console.log('The error is:\n' + error);
                        msg.reply(error.toString());
                    }
                }
            }
        }
        else {
            msg.reply(`Sorry, you can only send 5 messages every 30 seconds`);
        }
    }
}));
// Emitted whenever a member leaves a guild, or is kicked.
client.on('guildMemberRemove', member => {
    const guild = member.name;
    const channel = member.guild.channels.cache.find(ch => ch.name === 'chat');
    if (!channel)
        return;
    channel.send(`${member} has left ${guild}.`);
});
client.login(process.env.BOT_TOKEN);
//# sourceMappingURL=bot.js.map