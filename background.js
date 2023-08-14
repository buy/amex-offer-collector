import * as module from '/lib/domain-parser.js'

// Triggered on icon click, this handles the offer collecting process
chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes('https://global.americanexpress.com/offers/eligible')) {
    // observe offer details
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['/lib/domain-parser.js', '/utils/utils.js', '/amex/mutation-observer.js', '/amex/collect-offers.js']
    });
  } else if (tab.url.includes('https://global.americanexpress.com')) {
    chrome.tabs.update({
      url: 'https://global.americanexpress.com/offers/eligible'
    }, function (currentTab) {
      var listener = function(tabId, changeInfo, tab) {
        if (tabId == currentTab.id && changeInfo.status === 'complete') {
          // remove listener, so only run once
          chrome.tabs.onUpdated.removeListener(listener);
          // do stuff
          chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            files: ['/lib/domain-parser.js', '/utils/utils.js', '/amex/mutation-observer.js', '/amex/collect-offers.js']
          });
        }
      }
      chrome.tabs.onUpdated.addListener(listener);
    });
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changeInfo data and do something with it (like read the url)
  if (changeInfo.url) {
    var domain = psl.get(new URL(changeInfo.url).hostname);

    chrome.storage.local.get(domain).then((storageData) => {
      if (storageData[domain]) {
        // chrome.scripting.executeScript({
        //   target: { tabId },
        //   files: ['/lib/domain-parser.js', '/offers/offer-display.js']
        // });

        chrome.notifications.create(`offer_available_${tabId}`, {
          type: 'basic',
          iconUrl: '/icons/amex-offer-collector-icon-128.png',
          title: 'You have saved Amex Offer for this site!',
          message: `Click here to view your ${domain} offer on Amex`,
          priority: 2,
          requireInteraction: true,
        });
      }
    });
  }
});

chrome.notifications.onClicked.addListener(function (notificationId) {
  if (notificationId.startsWith('offer_available_')) {
    chrome.tabs.create({url: "https://global.americanexpress.com/offers/enrolled", active: true });
  }
});
