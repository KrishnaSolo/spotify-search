const { Buffer } = require('buffer');

const authBuilder = (client, secret) => {
    const authURI = 'https://accounts.spotify.com/api/token';
    const authConfig = {
        url: authURI,
        method: "post",
        params: {
            grant_type: "client_credentials"
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client + ':' + secret).toString('base64')),
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
    return authConfig;
};

module.exports = authBuilder;
