module.exports = {
    baseUrl: 'http://localhost:8089',
    rootElement: '#main',
    framework: 'jasmine2',
    specs: ['../**/*-test.js'],
    maxSessions: 1,
    onPrepare: function() {
        browser.ignoreSynchronization = true;
    }
};
