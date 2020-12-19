"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyApiHelper = void 0;
const SpotifyAccessToken_1 = require("../classes/Spotify/SpotifyAccessToken");
const https = require('https');
const axios = require('axios').default;
const qs = require('querystring');
class SpotifyApiHelper {
    constructor() {
        this.token = new SpotifyAccessToken_1.SpotifyAccessToken();
        this.getAccessTokenAsync = () => __awaiter(this, void 0, void 0, function* () {
            if (this.token.expires > Date.now()) {
                return this.token;
            }
            else {
                let config = {
                    'method': 'POST',
                    'baseURL': 'https://accounts.spotify.com',
                    'url': '/api/token',
                    'headers': {
                        'Authorization': `Basic ${process.env.SPOTIFY_BASE64_CLIENT}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': '__Host-device_id=AQBdCW3llYizcLcsO6eKEZjscj8xaYNfoPDz-oQKzZjV3ImKkmLKjvIr0kA530QP2LYygN0D7MZGQOq0jBZ-7JB5s86lQrcC7hI'
                    },
                    'data': qs.stringify({ 'grant_type': 'client_credentials' }),
                    'maxRedirects': 20
                };
                console.log('Making token request.');
                try {
                    let response = yield axios.request(config);
                    console.log(response);
                    let responseData = response['data'];
                    let accessToken = responseData['access_token'];
                    let tokenType = responseData['token_type'];
                    let expiresIn = response['expires_in'] * 1000;
                    let expires = Date.now() + expiresIn;
                    this.token.accessToken = accessToken;
                    this.token.tokenType = tokenType;
                    this.token.expires = expires;
                }
                catch (error) {
                    console.log('Error getting token.');
                }
                console.log('Returning token:\n' + this.token);
                return this.token;
            }
        });
        this.searchForTrackAsync = (track, artist) => __awaiter(this, void 0, void 0, function* () {
            let encodedTrackQuery = encodeURIComponent(track).trim();
            let encodedArtistQuery = encodeURIComponent(artist).trim();
            let accessToken = yield this.getAccessTokenAsync();
            let config = {
                'method': 'GET',
                'baseURL': 'https://api.spotify.com',
                'url': `/v1/search?q=track:${encodedTrackQuery}%20artist:${encodedArtistQuery}&type=track`,
                'headers': {
                    'Authorization': `Bearer ${accessToken.accessToken}}`,
                },
                'maxRedirects': 20
            };
            console.log('Making search request.');
            let response = yield axios.request(config);
            console.log(response.data);
            return JSON.parse(response.data);
        });
    }
}
exports.SpotifyApiHelper = SpotifyApiHelper;
//# sourceMappingURL=SpotifyApiHelper.js.map