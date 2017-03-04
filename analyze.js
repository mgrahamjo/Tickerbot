const api = require('./util/api');

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

module.exports = portfolio => new Promise(resolve => {

    const date = new Date();
    
    const data = {
        month: months[date.getMonth()],
        year: date.getFullYear(),
        day: date.getDate(),
        buyingPower: portfolio.buyingPower,
        value: 0,
        stocks: {}
    };

    api.get(Object.keys(portfolio.stocks)).then(stocks => {

        if (stocks && stocks.query.results) {

            stocks.query.results.row.forEach(stock => {

                data.stocks[stock.symbol] = {
                    price: stock.price,
                    qty: portfolio.stocks[stock.symbol]
                };

                data.value += stock.price * portfolio.stocks[stock.symbol];

            });

        }

        resolve(data);

    }).catch(error => {

        console.error(error);

        process.exit(1);

    });

});
