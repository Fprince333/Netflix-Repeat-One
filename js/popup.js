let options;

$(() => {
  $('body').on('click', 'a', function () {
    if (this && $(this).attr('href')) {
      chrome.tabs.create({url: $(this).attr('href')});
    }
    return false;
  });
  loadOptions(function (recOptions) {
    options = recOptions;
    // Set values on page to those saved
    $("#movie").prop('checked', options.repeatMovie);
    $("#episode").prop('checked', options.repeatEpisode);

    $('input').on('change', function () {
      changeOption(this);
    });
  });
});

function changeOption(elem) {
  switch (elem.id) {
    case "movie":
      options.repeatMovie = $('#movie')[0].checked;
      break;
    case "episode":
      options.repeatEpisode = $('#episode')[0].checked;
      break;
  }
  saveOptions();
}

function saveOptions() {
  console.log(options);
  chrome.storage.sync.set({
    'options': options
  }, () => {
    sendOptions(options);
  });
}