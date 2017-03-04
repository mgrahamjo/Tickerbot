const api = require('./util/api'),
    stocks = JSON.parse(require('fs').readFileSync('./stocks.json')),
    print = require('./util/print');

module.exports = portfolio => api.get(stocks).then(data => {

    const transactions = {
        buy: [],
        sell: []
    };

    data.query.results.row.forEach(stock => {

        stock.price = Number(stock.price);
        stock.average200 = Number(stock.average200);
        stock.averageDelta200 = parseFloat(stock.averageDelta200);
        stock.average50 = Number(stock.average50);
        stock.averageDelta50 = parseFloat(stock.averageDelta50);

        if (!portfolio.stocks[stock.symbol] &&
            stock.average200 > stock.average50 && 
            stock.average50 > stock.price &&
            stock.averageDelta50 < 0 &&
            stock.averageDelta50 > stock.averageDelta200) {

            stock.weight = (stock.averageDelta200 + stock.averageDelta50) * (stock.averageDelta200 - stock.averageDelta50);

            if (stock.weight > 5) {

                stock.quantity = 0;

                transactions.buy.push(stock);

            }

        } else if (portfolio.stocks[stock.symbol] &&
            stock.average200 < stock.average50 && 
            stock.average50 < stock.price &&
            stock.averageDelta50 > 0 &&
            stock.averageDelta50 < stock.averageDelta200) {

            stock.quantity = portfolio.stocks[stock.symbol];

            transactions.sell.push(stock);

        }

    });

    transactions.buy.sort((a, b) => b.weight - a.weight);
    
    print(transactions);
    
    let i = 0,
        failed = 0;

    while (portfolio.buyingPower > 0 && failed < transactions.buy.length) {

        const stock = transactions.buy[i];

        if (portfolio.buyingPower - stock.price >= 0) {

            stock.quantity++;

            portfolio.buyingPower -= stock.price;

            i++;

        } else {

            failed++;

        }

        if (i === transactions.buy.length) {

            i = 0;

        }

    }

    transactions.buyingPower = portfolio.buyingPower;

    transactions.buy = transactions.buy.filter(t => t.quantity);

    return transactions;

});
