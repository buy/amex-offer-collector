async function collecOffers() {
  // Show banner
  document.getElementById('skipToContent').innerHTML += `
  <div id="amex-offer-collector-banner">
    <button id="amex-offer-collector-close">x</button>
    <span id="amex-offer-banner-title">Amex Offer Collector is currently running on this page.</span> <br>
    <span id="amex-offer-banner-content"></span> <br>
  </div>
  <style>
    #amex-offer-collector-close {
      float: right;
      display: inline-block;
      padding: 0 10px 0 0;
    }

    #amex-offer-collector-banner {
      position: sticky;
      bottom: 0;
      background-color: #006fcf;
      padding-top: 20px;
      color: white;
      width: 100%;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      z-index: 99999;
    }
    
    #amex-offer-collector-banner a, #amex-offer-collector-banner #cta-content {
      border-radius: 100px;
      cursor: pointer;
      display: inline-block;
      font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
      padding: 7px 20px;
      text-align: center;
      text-decoration: none;
      transition: all 250ms;
      border: 0;
      font-size: 16px;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
    }
    
    #amex-offer-collector-banner .center {
      margin: auto;
      width: 50%;
      padding: 10px;
      text-align: center;
    }
    
    #amex-offer-collector-banner a#amex-offer-collector-bug {
      background-color: #d1320a;
      box-shadow: rgba(241, 7, 7, 0.2) 0 -25px 18px -14px inset,rgba(241, 7, 7, .15) 0 1px 2px,rgba(241, 7, 7, .15) 0 2px 4px,rgba(241, 7, 7, .15) 0 4px 8px,rgba(241, 7, 7, .15) 0 8px 16px,rgba(241, 7, 7, .15) 0 16px 32px;
      color: white;
      margin-top: 10px;
    }
    
    #amex-offer-collector-banner a#amex-offer-collector-bug:hover {
      box-shadow: rgba(241, 7, 7, .35) 0 -25px 18px -14px inset,rgba(241, 7, 7, .25) 0 1px 2px,rgba(241, 7, 7,.25) 0 2px 4px,rgba(241, 7, 7,.25) 0 4px 8px,rgba(241, 7, 7,.25) 0 8px 16px,rgba(241, 7, 7,.25) 0 16px 32px;
      transform: scale(1.05) rotate(-1deg);
    }
  </style>
  `;

  document.getElementById('amex-offer-collector-banner').innerHTML += `<a id='amex-offer-collector-bug' class="btn btn-primary" href="https://airtable.com/shrko65ccCW6fo8BZ" target="_blank" rel="noopener noreferrer" role="button">Report Bug</a> <br></br>`;
  document.getElementById('amex-offer-banner-content').innerText = `Getting things ready ...`;

  // attach event handler for close button
  document.getElementById('amex-offer-collector-close').onclick = function(){
    this.parentNode.parentNode.remove();
    return false;
  };

  await new Promise(r => setTimeout(r, 4000));

  var offerButtons = Array.from(document.getElementsByClassName("offer-cta")).filter(btn => btn.title == "Add to Card");
  var index;
  for (index = 0; index < offerButtons.length; ++index) {
    document.getElementById('amex-offer-banner-content').innerText = `${index} offers collected`;
    offerButtons[index].click();

    await new Promise(r => setTimeout(r, 1000));
  }

  document.getElementById('amex-offer-banner-title').remove();
  document.getElementById('amex-offer-banner-content').innerText = `All ${index} offers collected! =)\nPlease refresh the page to remove this banner.`;
}

chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes('https://global.americanexpress.com/offers/eligible')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: collecOffers
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
            function: collecOffers
          });
        }
      }
      chrome.tabs.onUpdated.addListener(listener);
    });
  }
});
