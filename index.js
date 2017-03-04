const portfolio = JSON.parse(require('fs').readFileSync('./data/portfolio.json')),
    trade = require('./trade'),
    analyze = require('./analyze'),
    jdrop = require('jdrop')(),
    backup = require('./util/backup'),
    api = require('./util/api');

api.ping('run');

analyze(portfolio).then(day => {

    console.log('Portfolio value: ' + day.value);
    console.log('Buying power   : ' + day.buyingPower);

    const path = 'analytics/' + day.month + day.year;

    return jdrop.get(path).then(month => {

        month = month || [];

        month[day.day] = day;

        return jdrop.put(path, month);

    });

}).then(() =>

    trade(portfolio)

).then(transactions => {

    transactions.buy.forEach(stock => {

        portfolio.stocks[stock.symbol] = stock.quantity;

        console.log(`bought ${stock.quantity} shares of ${stock.symbol}`);

    });

    transactions.sell.forEach(stock => {

        delete portfolio.stocks[stock.symbol];

        console.log(`sold ${stock.quantity} shares of ${stock.symbol}`);

    });

    return jdrop.put('portfolio', portfolio);

}).then(() => 

    backup()

).then(() => 

    api.ping('complete')

).catch(error => {

    api.ping('fail', encodeURIComponent(error));

    console.error(error);

    process.exit(1);

});
