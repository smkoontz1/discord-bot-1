const https = require('https');

let searchLyricText = (lyrics: string): string => {
    let data: string = '';
    
    https.get(`https://api.chartlyrics.com/apiv1.asmx/SearchLyricText?lyricText=${lyrics}`, (res) => {

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            return data;
        })

    }).on('error', (err) => {
        console.log('Error searching lyrics: ' + err.message);
    });

    return data;
}