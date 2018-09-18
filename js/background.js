chrome.runtime.onInstalled.addListener(function() {

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {urlMatches: 'https://www.(leitstellenspiel|missionchief|meldkamerspel)(.de|.com).*'},
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
    chrome.pageAction.onClicked.addListener(function() {
        chrome.tabs.query({active: true}, function(tab) {
            let game = tab[0].url.match('missionchief') ? "en" : tab[0].url.match('meldkamerspel') ? "nl" : "de";
            chrome.windows.create({
                'url': chrome.runtime.getURL('popup.html?game=' + game),
                'type': 'popup'
            });
        });
    });
    chrome.runtime.onMessageExternal.addListener(
        function(request, sender, sendResponse) {
            console.log(request);
            if (request.lss || request.mc || request.mk) {
                chrome.storage.sync.set(request, function () {
                    chrome.storage.sync.get(null, function (result) {
                        console.log('Updated storage: ', result);
                    })
                });
            }
        });
});
