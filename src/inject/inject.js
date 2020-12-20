let options = {};
chrome.runtime.onMessage.addListener(onMessage);

const MAX_TRIES_MONITOR_SKIP = 10;

function onMessage(message, sender, sendResponse) {
	if (message.action === 'optionsChanged') {
		options = message.options;
	}
}

$(_ => {
	loadOptions(receivedOptions => {
		options = receivedOptions;
		// It's a react app, so anytime they navigate away or to another title, we need to rehide/do all our options
		$('.main-header').on('click', '*', function () {
			startHelper();
		});
		startHelper();
	});
});

function enableRepeatEpisode(selectors) {
	/*Pulls all classes that start with "Watch Next" */
	selectors.push(".WatchNext-autoplay"); // Unknown if other international have localized class names
	selectors.push('.WatchNext-still-hover-container');
	selectors.push('[aria-label^="Next episode"]');
	selectors.push('[data-uia^="next-episode-seamless-button"]');
	selectors.push('.draining');
}

function enableRepeatMovie(selectors) {
	selectors.push('.postplay');
}

function startMonitoringForSelectors(selectors, numTries) {
	if (!selectors.length) {
		return;
	}
	/*Mutation observer for skippable elements*/
	const monitor = new MutationObserver(_ => {
		let selector = selectors.join(', ');
		let elems = document.querySelectorAll(selector);
		for (const elem of elems) {
			const newDataUia = elem.getAttribute("data-uia") || null;
			const isEpisode = (newDataUia && newDataUia.includes('watch-credits')) || (newDataUia &&newDataUia.includes('next-episode'));
			const isMovie = elem.classList;
			if (isEpisode && options.repeatEpisode) {
				window.location.reload()
			}
			if (isMovie && options.repeatMovie) {
				window.location.reload()
			}
		}
	});

	let reactEntry = document.getElementById("appMountPoint");
	if (reactEntry) {
		/*Start monitoring at react's entry point*/
		monitor.observe(reactEntry, {
			attributes: false, // Don't monitor attribute changes
			childList: true, //Monitor direct child elements (anything observable) changes
			subtree: true // Monitor all descendants
		});
	} else {
		if (numTries > MAX_TRIES_MONITOR_SKIP) {
			return;
		}
		numTries++;
		setTimeout(_ => {
			startMonitoringForSelectors(selectors, numTries);
		}, 100 * numTries);
	}
}

function startHelper() {
	let selectors = [];

	if (options.repeatMovie) {
		enableRepeatMovie(selectors);
	}

	if (options.repeatEpisode) {
		enableRepeatEpisode(selectors);
	}

	startMonitoringForSelectors(selectors, 0);
}