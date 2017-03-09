# Tickerbot

Tickerbot is a Node.js program that makes medium-term stock investments by checking for buy and sell opportunities once per day. It saves a snapshot of the portfolio each time it is run and backs up this data with git. 

Tickerbot analyzes all stocks listed in stocks.json - currently up to 200 - and uses freely available technical indicators from the Yahoo Finance API to predict an imending "Death Cross" (for sells) or "Golden Cross" (for buys). 

The default behavior is to paper trade, but the program is designed to be hooked up to [RobinHook](https://github.com/mgrahamjo/robinhook) to execute real commission-free trades.

## Cron

The following cron job will run the program at noon PST on weekdays (one hour before market close).

`0 12 * * 1-5 cd /path/to/Tickerbot && /usr/local/bin/node /path/to/Tickerbot/index.js {cronitorID}`

The cronitorID is an optional ID supplied by [cronitor.io](https://cronitor.io). If included, the program will ping a monitor and you will be alerted if it does not run or fails during execution.
