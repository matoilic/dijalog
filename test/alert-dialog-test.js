describe('alter dialog', function() {
    var config = require('./config/test-parameters');
    var ec = protractor.ExpectedConditions;

    function openAlert() {
        dijalog.alert('<p id="testMessage">Hello alert</p>');
    }

    beforeEach(function() {
        browser.get(browser.baseUrl);
        browser.wait(ec.presenceOf($('#open')));
    });

    it('should show an alert', function() {
        browser.executeScript(openAlert);

        expect($('#testMessage').isPresent()).toBeTruthy();
        expect($$('.dijalog-button').count()).toBe(1);
    });

    it('should hide the alert when clicking OK', function() {
        browser.executeScript(openAlert);

        $('.dijalog-button-primary').click();

        browser.wait(ec.not(ec.presenceOf($('#testMessage'))), config.defaultWaitTime);

        expect($('#testMessage').isPresent()).toBeFalsy();
    });

    it('should focus the OK button by default', function() {
        browser.executeScript(openAlert);

        browser.wait(ec.visibilityOf($('.dijalog-button-primary')), config.defaultWaitTime);

        expect(
            $('.dijalog-button-primary').getText()
        )
        .toEqual(
            browser.driver.switchTo().activeElement().getText()
        );
    });
});
