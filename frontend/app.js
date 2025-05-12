const studentForm = document.getElementById('student-form');
const nameInput = document.getElementById('name');
const interestsInput = document.getElementById('interests');
const entriesList = document.getElementById('entries-list');
const notificationContainer = document.getElementById('notification-container');

const API_URL = '/api';

// --- פונקציה להצגת הודעה אלגנטית בדף ---
function showNotification(message, type = 'success') {
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.textContent = message;
  notificationContainer.appendChild(notif);

  // אחרי 3 שניות מסירים אותה
  setTimeout(() => {
    notif.classList.add('fade-out');
    notif.addEventListener('transitionend', () => notif.remove());
  }, 3000);
}

// --- מחיקת רשומה ב־API ---
async function deleteEntry(id) {
  try {
    const res = await fetch(`${API_URL}/entries/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
    showNotification('הרשומה נמחקה בהצלחה');
    fetchEntries();
  } catch (err) {
    showNotification(`שגיאה במחיקה: ${err.message}`, 'error');
  }
}

// --- שליפת כל הרשומות ---
async function fetchEntries() {
  entriesList.innerHTML = '<div class="loading">Loading entries...</div>';
  try {
    const res = await fetch(`${API_URL}/entries`);
    if (!res.ok) throw new Error('Failed to fetch entries');
    const entries = await res.json();
    displayEntries(entries);
  } catch (err) {
    entriesList.innerHTML = `<div class="error">Error: ${err.message}</div>`;
  }
}

// --- הצגת הרשומות + כפתור מחיקה ---
function displayEntries(entries) {
  if (entries.length === 0) {
    entriesList.innerHTML = '<p>No entries yet. Be the first to add yours!</p>';
    return;
  }

  entriesList.innerHTML = '';
  entries.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.innerHTML = `
      <div class="entry-name">${entry.name}</div>
      <div class="entry-interests">${entry.interests}</div>
      <button class="delete-button">Delete</button>
    `;

    // bind למחיקה
    card.querySelector('.delete-button')
        .addEventListener('click', () => deleteEntry(entry.id));

    entriesList.appendChild(card);
  });
}

// --- הוספת רשומה חדשה ---
async function addEntry(data) {
  try {
    const res = await fetch(`${API_URL}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add entry');

    // נקה טופס
    nameInput.value = '';
    interestsInput.value = '';

    showNotification('הרשומה נוספה בהצלחה');
    fetchEntries();
  } catch (err) {
    showNotification(`שגיאה בהוספה: ${err.message}`, 'error');
  }
}

// --- אירועים ---
window.addEventListener('load', fetchEntries);

studentForm.addEventListener('submit', e => {
  e.preventDefault();
  addEntry({
    name: nameInput.value.trim(),
    interests: interestsInput.value.trim()
  });
});