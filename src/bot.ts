import * as ChartLyricsHelper from './helpers/ChartLyricsHelper';
import { SongMatch } from './classes/SongMatch';
import { SpotifyApiHelper } from './helpers/SpotifyApiHelper';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const Discord = require('discord.js');
const client = new Discord.Client();
const spotifyApiHelper = new SpotifyApiHelper();

const parseString = require('xml2js').parseString;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

const Lyrics: string = "^lyrics";

client.on('message', msg => {    
    if (msg.content === 'ping') {
        msg.reply('pong');
    }

    if (msg.content.startsWith(Lyrics)) {
        const lyricArgs: string = msg.content.slice(Lyrics.length).trim();

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

let getSongMatch = (lyrics: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        ChartLyricsHelper.searchLyricText(lyrics)
        .then((xmlData) => {
            let jsonData: JSON;
            
            parseString(xmlData, (err, result) => {
                jsonData = result;
            });
            
            let track: JSON = jsonData['ArrayOfSearchLyricResult'].SearchLyricResult[0];
            let artist: string = track['Artist'];
            let song: string = track['Song'];
    
            spotifyApiHelper.searchForTrack(song, artist)
            .then((trackData) => {
                let trackMatch: JSON = trackData['tracks'].items[0];
                let externalUrl: string = trackMatch['external_urls'].spotify;
    
                resolve(externalUrl);
            })
            .catch((reason) =>
            {
                reject(reason);
            });
        })
        .catch((reason) => {
            reject(reason);
        });
    });
    
}