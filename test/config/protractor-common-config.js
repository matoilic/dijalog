module.exports = {
    baseUrl: 'http://localhost:8089',
    rootElement: '#main',
    framework: 'jasmine2',
    specs: ['../**/*-test.js'],
    maxSessions: 1,
    /*jasmineNodeOpts: {
        defaultTimeoutInterval: 360000
    },*/
    onPrepare: function() {
        browser.manage().timeouts().pageLoadTimeout(400000);
        browser.manage().timeouts().implicitlyWait(3000);
        browser.ignoreSynchronization = true;
    }
};
