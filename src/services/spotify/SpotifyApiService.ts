import * as ChartLyricsService from './ChartLyricsService';
import * as StringHelper from '../../helpers/StringHelper';
import { SpotifyAccessToken } from '../../classes/spotify/SpotifyAccessToken';

const axios = require('axios').default;
const qs = require('querystring');
const parseString = require('xml2js').parseString;

export class SpotifyApiService {
    token: SpotifyAccessToken = new SpotifyAccessToken();

    getAccessTokenAsync = async (): Promise<SpotifyAccessToken> => {
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
                'data': qs.stringify({'grant_type': 'client_credentials'}),
                'maxRedirects': 20
            };
            
            try {
                let response: JSON = await axios.request(config);
                
                let responseData: JSON = response['data'];
                let accessToken = responseData['access_token'];
                let tokenType = responseData['token_type'];
    
                let expiresIn: number = response['expires_in'] * 1000;
                let expires: number = Date.now() + expiresIn;
    
                this.token.accessToken = accessToken;
                this.token.tokenType = tokenType;
                this.token.expires = expires;
            }
            catch (error) {
                console.log(`Error getting token:\n${error}`);
            }

            return this.token;
        }
    };
    
    searchForTrackAsync = async (track: string, artist: string): Promise<JSON> => {
        let encodedTrackQuery: string = encodeURIComponent(track).trim();
        let encodedArtistQuery: string = encodeURIComponent(artist).trim();

        let accessToken: SpotifyAccessToken = await this.getAccessTokenAsync();

        let config: object = {
            'method': 'GET',
            'baseURL': 'https://api.spotify.com',
            'url': `/v1/search?q=track:${encodedTrackQuery}%20artist:${encodedArtistQuery}&type=track`,
            'headers': {
                'Authorization': `Bearer ${accessToken.accessToken}}`,
            },
            'maxRedirects': 20
        };
        
        let response: JSON = await axios.request(config);

        return response['data'];
    }

    getSongMatchSpotifyUrlAsync = async (lyrics: string): Promise<string> => {
        let xmlLyricMatch: string = await ChartLyricsService.searchLyricTextAsync(lyrics);
        
        let jsonLyricMatch: JSON;    
        parseString(xmlLyricMatch, (err, result) => {
            jsonLyricMatch = result;
        });
            
        let track: JSON = jsonLyricMatch['ArrayOfSearchLyricResult'].SearchLyricResult[0];
        
        if (track['$'] !== undefined && track['$']['xsi:nil'] === 'true') {
            throw new Error('Could not find those lyrics.');
        }
    
        let artist: string = track['Artist'];
        let song: string = track['Song'];
    
        let cleanArtist: string = StringHelper.prepareStringForApi(artist);
        let cleanSong: string = StringHelper.prepareStringForApi(song);
    
        let spotifyTrackData: JSON = await this.searchForTrackAsync(cleanSong, cleanArtist);
    
        if (spotifyTrackData['tracks'].items.length <= 0) {
            throw new Error(`Spotify could not match the track: ${song} - ${artist}.`);
        }
    
        let trackMatch: JSON = spotifyTrackData['tracks'].items[0];
        let externalUrl: string = trackMatch['external_urls'].spotify;
    
        return externalUrl;
    }
}