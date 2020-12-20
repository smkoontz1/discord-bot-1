import { SpotifyApiService } from './services/spotify/SpotifyApiService';
import { UserService } from './services/user/UserService';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const Discord = require('discord.js');
const client = new Discord.Client();
const spotifyApiService = new SpotifyApiService();
const userService = new UserService();

client.on('ready', () => {
    client.user.setActivity('Use: ^boxcat');
    console.log(`Logged in as ${client.user.tag}`);
});

const LYRICS: string = "^lyrics";

client.on('message', async (msg) => {
    if (msg.author.tag !== client.user.tag) {
        let username: string = msg.author.username;

        if (userService.messageAllowedFrom(username)) {
            if (msg.content === '^boxcat') {
                msg.reply('```The current commands are:\n\n' +
                                '^ping\n' +
                                '^lyrics```');
            }
        
            if (msg.content === '^ping') {
                msg.reply('pong');
            }

            if (msg.content === 'cdtest') {
                msg.reply('cdtest made it: 4');
            }
        
            if (msg.content.startsWith(LYRICS)) {
                const lyricArgs: string = msg.content.slice(LYRICS.length).trim();
        
                if (lyricArgs === '') {
                    msg.reply('Please add lyric arguments.');
                }
                else {
                    try {
                        let spotifyUrl: string = await spotifyApiService.getSongMatchSpotifyUrlAsync(lyricArgs);
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
    
});

client.login(process.env.BOT_TOKEN);