const { Buffer } = require('buffer');

const axios = require('axios').default;

const spotifyApi = (client, secret) => {
    const clientID = client;
    const secretKey = secret;
    const authURI = 'https://accounts.spotify.com/api/token';
    const searchURI = 'https://api.spotify.com/v1/search?q=';
    let err_cnt = 0;
    const MAX_ERROR = 3;

    const authConfig = {
        url: authURI,
        method: "post",
        params: {
            grant_type: "client_credentials"
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(clientID + ':' + secretKey).toString('base64')),
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
    let token = '';

    async function authenticate() {
        try {
            const response = await axios(authConfig);
            token = response.data.access_token;
            const timeout = response.data.expires_in;
            //setTimeout(authenticate, timeout);
        } catch (e) {
            console.log('auth failed: ' + e);
        }
    };

    async function searchTrack(query) {
        try {
            const searchURL = searchURI + encodeURIComponent(query) + '&type=artist'
            const search = await axios({
                url: searchURL,
                method: "get",
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            });
            err_cnt = 0;
            console.log(search.data);

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
        auth: authenticate,
        search: searchTrack,
    };
};

module.exports = spotifyApi;
