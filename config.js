const axios = require('axios').default;

const httpService = async request => {
    const response = await axios(request);
    return response;
};

module.exports = httpService;
