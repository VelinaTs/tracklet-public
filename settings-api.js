// settings-api.js
// Backend API helpers for user settings

let USER_SETTINGS = {
  notifications: false,
  currency: 'USD',
  autoRefresh: true
};

// TODO: FETCH_USER_SETTINGS
async function fetchUserSettings() {
  try {
    const res = await fetch('/api/settings', { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch settings');
    USER_SETTINGS = await res.json();
    return USER_SETTINGS;
  } catch (e) {
    // fallback to defaults if needed
    return USER_SETTINGS;
  }
}

// TODO: UPDATE_USER_SETTINGS
async function updateUserSettings(newSettings) {
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    USER_SETTINGS = await res.json();
    return USER_SETTINGS;
  } catch (e) {
    // fallback: do not update global
    return USER_SETTINGS;
  }
}

// TODO: USE_BACKEND_SETTINGS
function getSetting(key) {
  return USER_SETTINGS[key];
}

function setSetting(key, value) {
  USER_SETTINGS[key] = value;
  updateUserSettings(USER_SETTINGS);
}

// TODO: REMOVE_LOCALSTORAGE_SETTINGS
// Remove all localStorage usage for settings in main code and use getSetting/setSetting

// TODO: TEST_SETTINGS_PERSISTENCE
// Test: Settings persist across devices and reloads
