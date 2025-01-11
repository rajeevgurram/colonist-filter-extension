document.getElementById('filterButton').addEventListener('click', () => {
    const mapName = document.getElementById('mapName').value.trim();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'filterGames', mapName });
    });
});

document.getElementById('allInterested').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'allInterested' });
    });
});
