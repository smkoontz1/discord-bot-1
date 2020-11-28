"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const Discord = require('discord.js');
const client = new Discord.Client();
const ChartLyricsHelper = require("./helpers/ChartLyricsHelper");
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});
const Lyrics = "^lyrics";
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
            let lyricArgs = args[1];
            getSongMatch(lyricArgs);
        }
    }
});
client.login(process.env.BOT_TOKEN);
let getSongMatch = (lyrics) => {
    let data = ChartLyricsHelper.searchLyricText(lyrics);
    console.log(data);
};
//# sourceMappingURL=bot.js.map