const httpService = require('./config')

const requestBuilder = () => {
    this._request = {
        url: '',
        method: '',
        params: {},
        headers: {},
    };

    this._setter = (key) => {
        this._request[key] = key;
        return this;
    };

    this.setUrl = url => this._setter(url);
    this.setMethod = method => this._setter(method);
    this.setParams = params => this._setter(params);
    this.setHeaders = headers => this._setter(headers);

    this.execute = async () => {
        res = await httpService(this._request);
        return res;
    };

    return {
        setUrl: this.setUrl,
        setMethod: this.setMethod,
        setParams: this.setParams,
        setHeaders: this.setHeaders,
        execute: this.execute,
    };
};

module.exports = requestBuilder;
