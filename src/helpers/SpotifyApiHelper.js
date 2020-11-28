"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyApiHelper = void 0;
const SpotifyAccessToken_1 = require("../classes/Spotify/SpotifyAccessToken");
const https = require('https');
const qs = require('querystring');
class SpotifyApiHelper {
    constructor() {
        this.token = new SpotifyAccessToken_1.SpotifyAccessToken();
        this.getAccessToken = () => {
            return new Promise((resolve, reject) => {
                if (this.token.expires > Date.now()) {
                    resolve(this.token);
                }
                else {
                    let options = {
                        'method': 'POST',
                        'hostname': 'accounts.spotify.com',
                        'path': '/api/token',
                        'headers': {
                            'Authorization': `Basic ${process.env.SPOTIFY_BASE64_CLIENT}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Cookie': '__Host-device_id=AQBdCW3llYizcLcsO6eKEZjscj8xaYNfoPDz-oQKzZjV3ImKkmLKjvIr0kA530QP2LYygN0D7MZGQOq0jBZ-7JB5s86lQrcC7hI'
                        },
                        'maxRedirects': 20
                    };
                    let req = https.request(options, (response) => {
                        let data = '';
                        response.on('data', (chunk) => {
                            data += chunk;
                        });
                        response.on('end', () => {
                            let json = JSON.parse(data);
                            let accessToken = json['access_token'];
                            let tokenType = json['token_type'];
                            let expiresIn = json['expires_in'] * 1000;
                            let expires = Date.now() + expiresIn;
                            this.token.accessToken = accessToken;
                            this.token.tokenType = tokenType;
                            this.token.expires = expires;
                            resolve(this.token);
                        });
                    }).on('error', (err) => {
                        console.log('Error obtaining authorization: ' + err.message);
                        reject(err.message);
                    });
                    let postData = qs.stringify({
                        'grant_type': 'client_credentials'
                    });
                    req.write(postData);
                    req.end();
                }
            });
        };
        this.searchForTrack = (track, artist) => {
            return new Promise((resolve, reject) => {
                let encodedTrackQuery = encodeURIComponent(track).trim();
                let encodedArtistQuery = encodeURIComponent(artist).trim();
                this.getAccessToken().then((accessToken) => {
                    let options = {
                        'method': 'GET',
                        'hostname': 'api.spotify.com',
                        'path': `/v1/search?q=track:${encodedTrackQuery}%20artist:${encodedArtistQuery}&type=track`,
                        'headers': {
                            'Authorization': `Bearer ${accessToken.accessToken}}`,
                        },
                        'maxRedirects': 20
                    };
                    let req = https.request(options, (response) => {
                        let data = '';
                        response.on('data', (chunk) => {
                            data += chunk;
                        });
                        response.on('end', () => {
                            resolve(JSON.parse(data));
                        });
                    }).on('error', (err) => {
                        console.log('Error searching for track: ' + err.message);
                        reject(err.message);
                    });
                    req.end();
                });
            });
        };
    }
}
exports.SpotifyApiHelper = SpotifyApiHelper;
//# sourceMappingURL=SpotifyApiHelper.js.map