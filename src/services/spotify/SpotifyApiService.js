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
exports.SpotifyApiService = void 0;
const ChartLyricsService = require("./ChartLyricsService");
const StringHelper = require("../../helpers/StringHelper");
const SpotifyAccessToken_1 = require("../../classes/spotify/SpotifyAccessToken");
const axios = require('axios').default;
const qs = require('querystring');
const parseString = require('xml2js').parseString;
class SpotifyApiService {
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
                try {
                    let response = yield axios.request(config);
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
                    console.log(`Error getting token:\n${error}`);
                }
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
            let response = yield axios.request(config);
            return response['data'];
        });
        this.getSongMatchSpotifyUrlAsync = (lyrics) => __awaiter(this, void 0, void 0, function* () {
            let xmlLyricMatch = yield ChartLyricsService.searchLyricTextAsync(lyrics);
            let jsonLyricMatch;
            parseString(xmlLyricMatch, (err, result) => {
                jsonLyricMatch = result;
            });
            let track = jsonLyricMatch['ArrayOfSearchLyricResult'].SearchLyricResult[0];
            if (track['$'] !== undefined && track['$']['xsi:nil'] === 'true') {
                throw new Error('Could not find those lyrics.');
            }
            let artist = track['Artist'];
            let song = track['Song'];
            let cleanArtist = StringHelper.prepareStringForApi(artist);
            let cleanSong = StringHelper.prepareStringForApi(song);
            let spotifyTrackData = yield this.searchForTrackAsync(cleanSong, cleanArtist);
            if (spotifyTrackData['tracks'].items.length <= 0) {
                throw new Error(`Spotify could not match the track: ${song} - ${artist}.`);
            }
            let trackMatch = spotifyTrackData['tracks'].items[0];
            let externalUrl = trackMatch['external_urls'].spotify;
            return externalUrl;
        });
    }
}
exports.SpotifyApiService = SpotifyApiService;
//# sourceMappingURL=SpotifyApiService.js.map