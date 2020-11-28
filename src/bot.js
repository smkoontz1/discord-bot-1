"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChartLyricsHelper = require("./helpers/ChartLyricsHelper");
const SpotifyApiHelper_1 = require("./helpers/SpotifyApiHelper");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const Discord = require('discord.js');
const client = new Discord.Client();
const spotifyApiHelper = new SpotifyApiHelper_1.SpotifyApiHelper();
const parseString = require('xml2js').parseString;
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});
const Lyrics = "^lyrics";
client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    }
    if (msg.content.startsWith(Lyrics)) {
        const lyricArgs = msg.content.slice(Lyrics.length).trim();
        if (lyricArgs === '') {
            msg.reply('Please add lyric arguments.');
        }
        else {
            getSongMatch(lyricArgs)
                .then((spotifyUrl) => {
                msg.reply("Is this your song?\n" + spotifyUrl);
            });
        }
    }
});
client.login(process.env.BOT_TOKEN);
let getSongMatch = (lyrics) => {
    return new Promise((resolve, reject) => {
        ChartLyricsHelper.searchLyricText(lyrics)
            .then((xmlData) => {
            let jsonData;
            parseString(xmlData, (err, result) => {
                jsonData = result;
            });
            let track = jsonData['ArrayOfSearchLyricResult'].SearchLyricResult[0];
            let artist = track['Artist'];
            let song = track['Song'];
            spotifyApiHelper.searchForTrack(song, artist)
                .then((trackData) => {
                let trackMatch = trackData['tracks'].items[0];
                let externalUrl = trackMatch['external_urls'].spotify;
                resolve(externalUrl);
            })
                .catch((reason) => {
                reject(reason);
            });
        })
            .catch((reason) => {
            reject(reason);
        });
    });
};
//# sourceMappingURL=bot.js.map