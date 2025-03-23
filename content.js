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

function isGameFull(element) {
    const totalPlayers = element.querySelectorAll(".player_count")[0].childNodes.length;
    const joinedPlayers = element.querySelectorAll(".player_count .tooltipmediumtext_left").length
    return totalPlayers > joinedPlayers
}

function isGameAvailable(game) {
    if(!game.classList) {
        return true;
    }

    return !game.classList.contains('lobby_table_row_unavailable');
}

function isTabActive(element) {
    return element.classList.contains("active");
}

function filterGamesByMap(mapNames) {
    const lobbyElement = document.getElementById('header_navigation_lobby');
    if(!isTabActive(lobbyElement)) {
        lobbyElement.click();
    }

    interval = setInterval(() => {
        const games = document.querySelectorAll('#lobby_center_rooms_table_body>tr');
            games
            .forEach((game) => {isGameFull(game);
                const modeElement = game.querySelectorAll('td')[0];
                const mapElement = game.querySelectorAll('td')[1];
                if (isGameAvailable(game) &&                        // Not Kicked Out
                    isElementHasValue(modeElement, ['Base']) &&     // Base Game
                    isElementHasValue(mapElement, mapNames) &&      // Selected Game
                    isGameFull(game)) {                             // Game not full
                        game.style.removeProperty('display');
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
