"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchLyricText = void 0;
const https = require('https');
const http = require('http');
let searchLyricText = (lyrics) => {
    return new Promise((resolve, reject) => {
        let encodedLyricQuery = encodeURIComponent(lyrics);
        http.get(`http://api.chartlyrics.com/apiv1.asmx/SearchLyricText?lyricText=${encodedLyricQuery}`, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            console.log('Error searching lyrics: ' + err.message);
            reject(err.message);
        });
    });
};
exports.searchLyricText = searchLyricText;
//# sourceMappingURL=ChartLyricsHelper.js.map