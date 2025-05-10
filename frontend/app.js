const studentForm = document.getElementById('student-form');
const nameInput = document.getElementById('name');
const interestsInput = document.getElementById('interests');
const entriesList = document.getElementById('entries-list');

// API endpoint (for the Python backend)
const API_URL = '/api';

// Fetch all entries from the backend
async function fetchEntries() {
  entriesList.innerHTML = '<div class="loading">Loading entries...</div>';

  try {
    const response = await fetch(`${API_URL}/entries`);
    if (!response.ok) {
      throw new Error('Failed to fetch entries');
    }

    const entries = await response.json();
    displayEntries(entries);
  } catch (error) {
    entriesList.innerHTML = `<div class="error">Error: ${error.message}</div>`;
  }
}

// Display entries in the UI
function displayEntries(entries) {
  if (entries.length === 0) {
    entriesList.innerHTML = '<p>No entries yet. Be the first to add yours!</p>';
    return;
  }

  entriesList.innerHTML = '';

  entries.forEach(entry => {
    const entryCard = document.createElement('div');
    entryCard.className = 'entry-card';

    entryCard.innerHTML = `
            <div class="entry-name">${entry.name}</div>
            <div class="entry-interests">${entry.interests}</div>
        `;

    entriesList.appendChild(entryCard);
  });
}

// Add a new entry
async function addEntry(entryData) {
  try {
    const response = await fetch(`${API_URL}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entryData)
    });

    if (!response.ok) {
      throw new Error('Failed to add entry');
    }

    // Clear form inputs
    nameInput.value = '';
    interestsInput.value = '';

    // Refresh entries list
    fetchEntries();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Event Listeners
window.addEventListener('load', fetchEntries);

studentForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const entryData = {
    name: nameInput.value.trim(),
    interests: interestsInput.value.trim()
  };

  addEntry(entryData);
});
