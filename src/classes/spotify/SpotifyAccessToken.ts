export class SpotifyAccessToken {
    accessToken: string;
    tokenType: string;
    expires: number;

    constructor(accessToken: string = '', tokenType: string = '', expires: number = 0) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.expires = expires;
    }
}