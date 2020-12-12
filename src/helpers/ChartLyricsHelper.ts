const axios = require('axios').default;

let searchLyricTextAsync = async (lyrics: string): Promise<string> => {
    let encodedLyricQuery: string = encodeURIComponent(lyrics);

    let response = await axios.get(`http://api.chartlyrics.com/apiv1.asmx/SearchLyricText?lyricText=${encodedLyricQuery}`);

    return response.data;
};

export { searchLyricTextAsync };