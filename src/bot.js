"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChartLyricsHelper = require("./helpers/ChartLyricsHelper");
const StringHelper = require("./helpers/StringHelper");
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
            })
                .catch((reason) => {
                msg.reply(reason);
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
            console.log(track);
            console.log(track['$']);
            if (track['$'] !== undefined && track['xsi:nil'] === 'true') {
                reject('Could not find those lyrics.');
            }
            let artist = track['Artist'];
            let song = track['Song'];
            let cleanArtist = StringHelper.prepareStringForApi(artist);
            let cleanSong = StringHelper.prepareStringForApi(song);
            console.log(cleanArtist);
            console.log(cleanSong);
            spotifyApiHelper.searchForTrack(cleanSong, cleanArtist)
                .then((trackData) => {
                console.log(trackData);
                if (trackData['tracks'].items.length <= 0) {
                    reject(`Spotify could not match the track: ${song} - ${artist}.`);
                }
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