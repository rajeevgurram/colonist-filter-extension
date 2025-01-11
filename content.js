// Function to filter games by map name
var interval;
function clearTimer() {
    if(interval) {
        clearInterval(interval);
    }
}

function isElementHasValue(element, values) {
    console.log(element, values);
    return element && values.includes(element.textContent.trim());
}

function isGameAvailable(game) {
    if(!game.classList) {
        return true;
    }

    return !game.classList.contains('lobby_table_row_unavailable');
}

function filterGamesByMap(mapNames) {
    document.getElementById('header_navigation_lobby').click();
    interval = setInterval(() => {
        const games = document.querySelectorAll('#lobby_center_rooms_table_body>tr');
            games
            .forEach((game) => {
                const modeElement = game.querySelectorAll('td')[0];
                const mapElement = game.querySelectorAll('td')[1];
                if (isGameAvailable(game) &&                        // Not Kicked Out
                    isElementHasValue(modeElement, ['Base']) &&     // Base Game
                    isElementHasValue(mapElement, mapNames)) {      // Selected Game
                        game.style.display = 'inline-block';
                        game.click();
                        clearTimer();
                        setTimeout(() => {
                            const checkbox = document.getElementById('room_center_checkbox_ready');
                            checkbox.click();
                            checkbox.checked = true;
                            checkbox.setAttribute('checked', 'true');
                        }, 1500);
                } else {
                    game.style.display = 'none';
                }
            });
    }, 1000);
}
  
// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'filterGames') {
        if(interval) {
            clearTimer();
        }
        filterGamesByMap([message.mapName]);
        sendResponse({ status: 'done' });
    } else if (message.action === 'allInterested') { 
        clearTimer();
        filterGamesByMap(['Gold Rush', 'Black Forest', 'Volcano']);
    }
});
