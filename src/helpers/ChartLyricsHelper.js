"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchLyricText = void 0;
const https = require('https');
let searchLyricText = (lyrics) => {
    let data = '';
    https.get(`https://api.chartlyrics.com/apiv1.asmx/SearchLyricText?lyricText=${lyrics}`, (res) => {
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            return data;
        });
    }).on('error', (err) => {
        console.log(err);
        console.log('Error searching lyrics: ' + err.message);
    });
    return data;
};
exports.searchLyricText = searchLyricText;
//# sourceMappingURL=ChartLyricsHelper.js.map