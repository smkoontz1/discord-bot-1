import * as ChartLyricsHelper from './helpers/ChartLyricsHelper';
import * as StringHelper from './helpers/StringHelper';
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
            })
            .catch((reason) => {
                msg.reply(reason);
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
            
            if (track['$'] !== undefined && track['$']['xsi:nil'] === 'true') {
                reject('Could not find those lyrics.');
            }

            let artist: string = track['Artist'];
            let song: string = track['Song'];

            let cleanArtist: string = StringHelper.prepareStringForApi(artist);
            let cleanSong: string = StringHelper.prepareStringForApi(song);
    
            spotifyApiHelper.searchForTrack(cleanSong, cleanArtist)
            .then((trackData) => {
                console.log(trackData);

                if (trackData['tracks'].items.length <= 0) {
                    reject(`Spotify could not match the track: ${song} - ${artist}.`);
                }

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