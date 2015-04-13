chrome.app.runtime.onLaunched.addListener(function(launchData) {
    chrome.app.window.create('../index.html', {
        id: "CrazyChat",
        innerBounds: {
            width: 320,
            height: 400
        },
        frame: 'chrome',
        resizable: false
    });
});

chrome.runtime.onInstalled.addListener(function() {
    console.log('installed');
});

chrome.runtime.onSuspend.addListener(function() {
    // Do some simple clean-up tasks.
});
