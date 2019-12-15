function updateStorage(status) {
  chrome.storage.sync.set({'status': status});
}
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'Enable',
    title: 'Enable',
    type: 'radio',
    contexts: ['all'],
  }, updateStorage('Enabled'));
  chrome.contextMenus.create({
    id: 'Disable',
    title: 'Disable',
    type: 'radio',
    contexts: ['all'],
  });
});

chrome.contextMenus.create({
  id: 'Enable',
  title: 'Enable',
  type: 'radio',
  contexts: ['all'],
});
chrome.contextMenus.create({
  id: 'Disable',
  title: 'Disable',
  type: 'radio',
  contexts: ['all'],
});

chrome.contextMenus.onClicked.addListener(function(item, tab) {
  updateStorage(item.menuItemId);
  chrome.contextMenus.update(item.menuItemId, { checked: true })
});

chrome.storage.onChanged.addListener(function(changes) {
  chrome.storage.sync.get("status", function (obj) {
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        const tabId = tab.id;
        chrome.tabs.sendMessage(tabId, obj)
      });
    });
  });
});
