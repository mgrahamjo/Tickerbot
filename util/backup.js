const spawn = require('child_process').spawn,
    cronitor = process.argv[2];

module.exports = () => new Promise(resolve => {

    if (cronitor) {

        spawn('git', ['commit', '-am', 'Auto backup ' + new Date().toJSON().substring(0, 10)], {
            stdio: 'inherit'
        }).on('close', code => {

            if (code === 0) {

                spawn('git', ['push'], {
                    stdio: 'inherit'
                }).on('close', resolve);

            } else {

                resolve();

            }

        });

    } else {

        resolve();
        
    }

});
