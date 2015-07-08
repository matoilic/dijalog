var config = require('./protractor-common-config');

config.seleniumServerJar = __dirname + '/../../node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar';
config.multiCapabilities = [
    {
        browserName: 'chrome',
        chromeOptions: {
            args: ['no-sandbox']
        }
    },
    {
        browserName: 'firefox'
    }
];

module.exports.config = config;
