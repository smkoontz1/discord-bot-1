const https = require('https');
const http = require('http');

let searchLyricText = (lyrics: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        let encodedLyricQuery = encodeURIComponent(lyrics);

        http.get(`http://api.chartlyrics.com/apiv1.asmx/SearchLyricText?lyricText=${encodedLyricQuery}`, (response) => {
            let data: string = '';

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

export { searchLyricText };