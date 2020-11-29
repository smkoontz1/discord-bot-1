import * as ChartLyricsHelper from './helpers/ChartLyricsHelper';
import * as StringHelper from './helpers/StringHelper';
import { SongMatch } from './classes/Spotify/SongMatch';
import { SpotifyApiHelper } from './helpers/SpotifyApiHelper';
import { UserMessageInfo } from './classes/User/UserMessageInfo';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const Discord = require('discord.js');
const client = new Discord.Client();
const spotifyApiHelper = new SpotifyApiHelper();

const parseString = require('xml2js').parseString;

client.on('ready', () => {
    client.user.setActivity('Use: ^boxcat');
    console.log(`Logged in as ${client.user.tag}`);
});

let userMessageInfoMap: Map<string, UserMessageInfo> = new Map<string, UserMessageInfo>();

const LYRICS: string = "^lyrics";

client.on('message', msg => {
    if (msg.author.tag !== client.user.tag) {
        let username: string = msg.author.username;

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
                const lyricArgs: string = msg.content.slice(LYRICS.length).trim();
        
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
        }
        else {
            msg.reply(`Sorry, you can only send 5 messages every 30 seconds`);
        }
    }
    
});

client.login(process.env.BOT_TOKEN);

const MESSAGE_LIMIT: number = 5;

let messageAllowedFrom = (username: string): boolean => {
    let userInfo = userMessageInfoMap.get(username);

    if (userInfo === undefined) {
        userMessageInfoMap.set(username, new UserMessageInfo(username));
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
}

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