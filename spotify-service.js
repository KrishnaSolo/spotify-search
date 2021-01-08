const spotify = require('./spotify-wrapper');

const client = 'bdf53d0a61cf41638a9406598fbd0a4d';
const secret = 'c4ad66b3459f49dda7f99265c75cd2d4';

spotify.setCredentials(client,secret);
const runQuery = async (query='drake') => {
    try {
        const results = await spotify.search(query);
        console.log(results.tracks);
        return results;
    } catch(e) {
        console.log(e);
    }
}
runQuery();
