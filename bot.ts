if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

const Lyrics: string = "^lyrics";

client.on('message', msg => {    
    if (msg.content === 'ping') {
        msg.reply('pong');
    }

    if (msg.content.startsWith(Lyrics)) {
        const args = msg.content.split(' ');

        if (args.length <= 1) {
            msg.reply('Please provide lyrics.');
        }
        else {
            let lyricArgs: string = args[1];
            getSongMatch(lyricArgs);
        }
    }
});

client.login(process.env.BOT_TOKEN);

let getSongMatch = (lyrics: string): void => {
    let data: string = searchLyricText(lyrics);
    console.log(data);
}