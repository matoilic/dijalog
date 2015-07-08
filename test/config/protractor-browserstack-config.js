var config = require('./protractor-common-config');
var bs = require('./browserstack');

function capabilitiesForBrowserStack(capabilities) {
    return {
        'browserstack.user': bs.user,
        'browserstack.key': bs.key,
        'browserstack.local' : 'true',
        'browserstack.debug': 'true',
        'name': 'Dijalog',
        'browserName': capabilities.browser,
        'browser': capabilities.browser,
        'browser_version': capabilities.browserVersion,
        'version': capabilities.browserVersion,
        'os': capabilities.os,
        'os_version': capabilities.osVersion,
        'resolution': capabilities.resolution || '1280x1024'
    };
}

config.seleniumAddress = 'http://hub.browserstack.com/wd/hub';
config.multiCapabilities = [
    //Windows 8.1
    capabilitiesForBrowserStack({
        browser: 'IE',
        browserVersion: '11.0',
        os: 'Windows',
        osVersion: '8.1'
    })/*,
    capabilitiesForBrowserStack({
        browser: 'Chrome',
        browserVersion: '39.0',
        os: 'Windows',
        osVersion: '8.1'
    }),
    capabilitiesForBrowserStack({
        browser: 'Firefox',
        browserVersion: '35.0',
        os: 'Windows',
        osVersion: '8.1'
    }),

    //Windows 7
    capabilitiesForBrowserStack({
        browser: 'IE',
        browserVersion: '11.0',
        os: 'Windows',
        osVersion: '7'
    }),
    capabilitiesForBrowserStack({
        browser: 'Chrome',
        browserVersion: '39.0',
        os: 'Windows',
        osVersion: '7'
    }),
    capabilitiesForBrowserStack({
        browser: 'Firefox',
        browserVersion: '35.0',
        os: 'Windows',
        osVersion: '7'
    }),

    //OS X Yosemite
    capabilitiesForBrowserStack({
        browser: 'Safari',
        browserVersion: '8.0',
        os: 'OS X',
        osVersion: 'Yosemite'
    }),
    capabilitiesForBrowserStack({
        browser: 'Chrome',
        browserVersion: '39.0',
        os: 'OS X',
        osVersion: 'Yosemite'
    }),
    capabilitiesForBrowserStack({
        browser: 'Firefox',
        browserVersion: '35.0',
        os: 'OS X',
        osVersion: 'Yosemite'
    }),

    //OS X Mavericks
    capabilitiesForBrowserStack({
        browser: 'Safari',
        browserVersion: '7.0',
        os: 'OS X',
        osVersion: 'Mavericks'
    }),
    capabilitiesForBrowserStack({
        browser: 'Chrome',
        browserVersion: '39.0',
        os: 'OS X',
        osVersion: 'Mavericks'
    }),
    capabilitiesForBrowserStack({
        browser: 'Firefox',
        browserVersion: '35.0',
        os: 'OS X',
        osVersion: 'Mavericks'
    })*/
];

module.exports.config = config;
