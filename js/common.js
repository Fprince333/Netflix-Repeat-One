// Load options from local storage
// Return default values if none exist
function loadOptions(callback) {
  chrome.storage.sync.get('options', items => {
    let options = items['options'];
    if (options == null || options === "{}") {
      options = {};
    }

    options.repeatMovie = options.hasOwnProperty('repeatMovie') ? options.repeatMovie : true;
    options.repeatEpisode = options.hasOwnProperty('repeatEpisode') ? options.repeatEpisode : true;

    chrome.storage.sync.set({
      'options': options
    }, _ => {
      callback(options);
    });
  });

}

// Send options to all tabs and extension pages
function sendOptions(options) {
  let request = {
    action: 'optionsChanged',
    'options': options
  };

  // Send options to all tabs
  chrome.windows.getAll(null, function (windows) {
    for (let i = 0; i < windows.length; i++) {
      chrome.tabs.query({ windowId: windows[i].id }, function (tabs) {
        for (let j = 0; j < tabs.length; j++) {
          chrome.tabs.sendMessage(tabs[j].id, request);
        }
      })
    }
  });

  // Send options to other extension pages
  chrome.runtime.sendMessage(request);
}