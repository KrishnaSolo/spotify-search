const authBuilder = require('./auth-builder')
const httpService = require('./config')
const MAX_ERROR = 3;

const spotifyApi = (client, secret) => {
    const clientID = client;
    const secretKey = secret;
    const searchURI = 'https://api.spotify.com/v1/search?q=';

    let token = '';
    let err_cnt = 0;

    async function authenticate() {
        try {
            const response = await httpService(authBuilder(clientID, secretKey));
            token = response.data.access_token;
        } catch (e) {
            console.log('auth failed: ' + e);
        }
    };

    async function searchTrack(query) {
        try {
            const searchURL = searchURI + encodeURIComponent(query) + '&type=artist'
            const search = await httpService({
                url: searchURL,
                method: "get",
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            });
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
        auth: authenticate,
        search: searchTrack,
    };
};

module.exports = spotifyApi;
