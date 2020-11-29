const authService = require('./auth-service');
const RequestBuilder = require('./requestBuilder');
const MAX_ERROR = 3;

// using an IIFE as you only need one instance of spotify api
const SpotifyApi = (() => {
    let clientID = '';
    let secretKey = '';
    const searchURI = 'https://api.spotify.com/v1/search?q=';

    let token = '';
    let err_cnt = 0;

    async function authenticate() {
        if(!clientID || !secretKey) return console.log('Please set credentials first');
        try {
            const response = await authService(clientID, secretKey);
            token = response.data.access_token;
        } catch (e) {
            console.log('auth failed: ' + e);
        }
    };

    function setCredentials(id, key) {
        clientID = id;
        secretKey = key;
    };

    async function searchTrack(query) {
        try {
            const searchURL = searchURI + encodeURIComponent(query) + '&type=artist'
            const header = {
                'Authorization': 'Bearer ' + token,
            };

            const request = new RequestBuilder();
            const search = await request.setUrl(searchURL).setMethod("get").setHeaders(header).execute();

            err_cnt = 0;
            console.log(search.data);
            return search.data;

        } catch (e) {
            if(err_cnt < MAX_ERROR) {
                authenticate();
                searchTrack(query);
                err_cnt++;
            } else {
                err_cnt = 0;
                console.log('search failed: ' + e);
            }
        }
    };

    return {
        setCredentials: setCredentials,
        search: searchTrack,
    };
})();

module.exports = SpotifyApi;
