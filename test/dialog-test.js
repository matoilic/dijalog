describe('dialog', function() {
    var driver = browser.driver;

    function openAlert() {
        dijalog.alert('<p id="testMessage">Hello alert</p>');
    }

    beforeEach(function() {
        driver.get(browser.baseUrl);
        driver.wait(driver.isElementPresent(by.css('#open')));
    });

    it('should show an alert', function() {
        browser.executeScript(openAlert);

        expect(element(by.css('#testMessage')).isPresent()).toBeTruthy();
        expect(element.all(by.css('.dijalog-button')).count()).toBe(1);
    });

    it('should hide the alert when clicking OK', function() {
        browser.executeScript(openAlert);

        element(by.css('.dijalog-button-primary')).click();
        driver.wait(function() {
            return !driver.isElementPresent(by.css('.dijalog-content'));
        });
        expect(element(by.css('#testMessage')).isPresent()).toBeFalsy();
    })
});