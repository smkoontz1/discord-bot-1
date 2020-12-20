"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyAccessToken = void 0;
class SpotifyAccessToken {
    constructor(accessToken = '', tokenType = '', expires = 0) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.expires = expires;
    }
}
exports.SpotifyAccessToken = SpotifyAccessToken;
//# sourceMappingURL=SpotifyAccessToken.js.map