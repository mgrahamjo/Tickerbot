const spawn = require('child_process').spawn;

module.exports = () => new Promise(resolve => {

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

});
