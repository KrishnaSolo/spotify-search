const authService = require('./auth-service');
const RequestBuilder = require('./requestBuilder');
const MAX_ERROR = 3;

// using an IIFE as you only need one instance of spotify api
const SpotifyApi = (() => {
    let clientID = '';
    let secretKey = '';

    let token = '';
    let timeout_timestamp = '';
    let err_cnt = 0;

    //takes in id and keys and call auth service to get token and timeout based on current time
    async function authenticate() {
        if(!clientID || !secretKey) return console.log('Please set credentials first');
        try {
            const response = await authService(clientID, secretKey);
            const curr_time = new Date(Date.now());

            //set token and timeout for services
            token = response.data.access_token;
            timeout_timestamp = curr_time.setSeconds(curr_time.getSeconds() + 3600) 
        } catch (e) {
            console.log('auth failed: ' + e);
        }
    };

    //option to update auth creds 
    function setCredentials(id, key) {
        clientID = id;
        secretKey = key;
    };


    //take query and searches against tracks
    async function searchTrack(query) {
        try {
            //only auth if token has expired
            if(Date.now() > timeout_timestamp ) await authenticate();

            const searchURL = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`;
            const header = {
                'Authorization': 'Bearer ' + token,
            };

            //Build a request using builder and execute to send request
            const request = new RequestBuilder();
            const search = await request.setUrl(searchURL).setMethod("get").setHeaders(header).execute();

            err_cnt = 0;
            return search.data;

        } catch (e) {
            if(err_cnt < MAX_ERROR) {
                await authenticate();
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
