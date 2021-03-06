const request = require('./request'),
    serialize = require('./serialize'),
    cronitor = process.argv[2];

function api(opts) {

    opts.headers = opts.headers || {};

    opts.headers.Accept = 'application/json';

    if (opts.method === 'POST') {

        opts.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

    }

    if (opts.token) {

        opts.headers.Authorization = `Token ${opts.token}`;

    }

    console.log(`${opts.method} ${opts.host}...`);

    return request({
        host: opts.host,
        path: opts.url,
        method: opts.method,
        headers: opts.headers
    }, opts.data ? serialize(opts.data) : undefined);

}

function makeURL(symbols) {

    symbols = symbols.join('%2C');

    return `/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D${symbols}%26f%3Dspm4m6m3m8%26e%3D.csv'%20and%20columns%3D'symbol%2Cprice%2Caverage200%2CaverageDelta200%2Caverage50%2CaverageDelta50'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;

}

api.get = symbols => api({
    host: 'query.yahooapis.com',
    url: makeURL(symbols),
    method: 'GET'
});

api.ping = (flag, message) => 

    cronitor ? api({
        host: 'cronitor.link',
        url: `/${cronitor}/${flag}?msg=${message}`,
        method: 'GET'
    }) : Promise.resolve();

module.exports = api;
