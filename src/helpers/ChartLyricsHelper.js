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
exports.searchLyricTextAsync = void 0;
const axios = require('axios').default;
let searchLyricTextAsync = (lyrics) => __awaiter(void 0, void 0, void 0, function* () {
    let encodedLyricQuery = encodeURIComponent(lyrics);
    let response = yield axios.get(`http://api.chartlyrics.com/apiv1.asmx/SearchLyricText?lyricText=${encodedLyricQuery}`);
    return response.data;
});
exports.searchLyricTextAsync = searchLyricTextAsync;
//# sourceMappingURL=ChartLyricsHelper.js.map