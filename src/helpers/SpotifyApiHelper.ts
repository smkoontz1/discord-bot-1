import { SpotifyAccessToken } from '../classes/Spotify/SpotifyAccessToken';

const https = require('https');
const axios = require('axios').default;
const qs = require('querystring');

export class SpotifyApiHelper {
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
            
            console.log('Making token request.');
            try {
                let response: JSON = await axios.request(config);
                console.log(response);
                
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
                console.log('Error getting token.');
            }

            console.log('Returning token:\n' + this.token);
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
        
        console.log('Making search request.');
        let response = await axios.request(config);
        console.log(response.data);

        return JSON.parse(response.data);
    }
}