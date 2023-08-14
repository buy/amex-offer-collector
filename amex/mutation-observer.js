function extractOfferDetails() {
  var offerWebsite = document.querySelector('#detailsContainer .Linkify a')?.textContent;

  if (offerWebsite) {
    var domain = psl.get(offerWebsite);
    var details = document.querySelector('#detailsContainer .Linkify').innerHTML;
    // if no expire, set to 3 months later
    var expiresAt = getDate(details)[0] || new Date(Date.now() + 2629800000 * 3);

    chrome.storage.local.set({
      [domain]: {
        details,
        expiresAt
      }
    }).then(() => {
      console.debug('[Amex Offer Collector] Offer Collected', domain, expiresAt, details);
    });
  }
}

// Listen to lazyload DOM changes
function amexOffersMutationObserver() {
  var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    // if offer terms exist
    if (document.getElementById('detailsContainer')) {
      extractOfferDetails();
    }
  });

  // define what element should be observed by the observer
  // and what types of mutations trigger the callback
  observer.observe(document.querySelector('.offers-list'), {
    childList: true,
    subtree: true
  });
}

// Main
amexOffersMutationObserver();
