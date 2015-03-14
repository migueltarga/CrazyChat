chrome.app.runtime.onLaunched.addListener(function(launchData) {
    chrome.app.window.create('../index.html', {
        id: "CrazyChat",
        innerBounds: {
            width: 300,
            height: 400,
            minWidth: 300,
            minHeight: 400
        },
        frame: 'chrome'
    });
});

chrome.runtime.onInstalled.addListener(function() {
    console.log('installed');
});

chrome.runtime.onSuspend.addListener(function() {
    // Do some simple clean-up tasks.
});
