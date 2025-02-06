let agents = [];

// Fetch agent data from API
fetch('https://valorant-api.com/v1/agents')
.then(response => response.json())
.then(data => {
    // Filter out only playable agents
    agents = data.data.filter(agent => agent.isPlayableCharacter);
})
.catch(error => console.error('Error fetching data:', error));

// Function to display a random agent
function getRandomAgent() {
    if (agents.length === 0) {
        document.getElementById('agentData').innerHTML = "<p class='loading'>Loading agents... Try again.</p>";
        return;
    }

    const randomIndex = Math.floor(Math.random() * agents.length);
    const agent = agents[randomIndex];
    document.getElementById('agentData').innerHTML = `
        <p class="agent-name">${agent.displayName}</p>
        <img src="${agent.fullPortrait}" alt="${agent.displayName}">
    `;
}

// Add event listener to the button
document.getElementById('newAgentButton').addEventListener('click', getRandomAgent);