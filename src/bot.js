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
const ChartLyricsHelper = require("./helpers/ChartLyricsHelper");
const StringHelper = require("./helpers/StringHelper");
const SpotifyApiHelper_1 = require("./helpers/SpotifyApiHelper");
const UserMessageInfo_1 = require("./classes/User/UserMessageInfo");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const Discord = require('discord.js');
const client = new Discord.Client();
const spotifyApiHelper = new SpotifyApiHelper_1.SpotifyApiHelper();
const parseString = require('xml2js').parseString;
client.on('ready', () => {
    client.user.setActivity('Use: ^boxcat');
    console.log(`Logged in as ${client.user.tag}`);
});
let userMessageInfoMap = new Map();
const LYRICS = "^lyrics";
client.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.author.tag !== client.user.tag) {
        let username = msg.author.username;
        if (messageAllowedFrom(username)) {
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
                        let spotifyUrl = yield getSongMatchSpotifyUrlAsync(lyricArgs);
                        msg.reply("Is this your song?\n" + spotifyUrl);
                    }
                    catch (error) {
                        console.log('Attempting to send an error');
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
client.login(process.env.BOT_TOKEN);
const MESSAGE_LIMIT = 5;
let messageAllowedFrom = (username) => {
    let userInfo = userMessageInfoMap.get(username);
    if (userInfo === undefined) {
        userMessageInfoMap.set(username, new UserMessageInfo_1.UserMessageInfo(username));
        return true;
    }
    else if (Date.now() > userInfo.messageResetTime) {
        userInfo.resetMessageCooldown();
        return true;
    }
    userInfo.messageCount++;
    if (userInfo.messageCount <= MESSAGE_LIMIT) {
        return true;
    }
    return false;
};
let getSongMatchSpotifyUrlAsync = (lyrics) => __awaiter(void 0, void 0, void 0, function* () {
    let xmlData = yield ChartLyricsHelper.searchLyricTextAsync(lyrics);
    let jsonData;
    parseString(xmlData, (err, result) => {
        jsonData = result;
    });
    let track = jsonData['ArrayOfSearchLyricResult'].SearchLyricResult[0];
    if (track['$'] !== undefined && track['$']['xsi:nil'] === 'true') {
        throw new Error('Could not find those lyrics.');
    }
    let artist = track['Artist'];
    let song = track['Song'];
    let cleanArtist = StringHelper.prepareStringForApi(artist);
    let cleanSong = StringHelper.prepareStringForApi(song);
    let trackData = yield spotifyApiHelper.searchForTrackAsync(cleanSong, cleanArtist);
    if (trackData['tracks'].items.length <= 0) {
        throw new Error(`Spotify could not match the track: ${song} - ${artist}.`);
    }
    let trackMatch = trackData['tracks'].items[0];
    let externalUrl = trackMatch['external_urls'].spotify;
    return externalUrl;
});
//# sourceMappingURL=bot.js.map