// This script snippet replaces the initApp() function to fetch user from auth/me

async function initAppUpdated() {
  initTheme();
  
  // Fetch user from backend
  try {
    const response = await fetch('https://price-monitor-backend-production-e326.up.railway.app/auth/me', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      const user = data.user || data;
      
      // Update sidebar with user info
      const name = user.name || user.email || 'User';
      document.getElementById('sidebarName').textContent = name;
      
      // Use Google profile picture if available, else use avatar with initials
      const avatarEl = document.getElementById('sidebarAvatar');
      if (user.picture) {
        avatarEl.style.backgroundImage = `url('${user.picture}')`;
        avatarEl.style.backgroundSize = 'cover';
        avatarEl.style.backgroundPosition = 'center';
        avatarEl.style.fontSize = '0'; // Hide text if image loads
        avatarEl.textContent = '';
      } else {
        avatarEl.textContent = name.charAt(0).toUpperCase();
      }
    } else {
      console.warn('Auth failed - redirecting to login');
      window.location.href = '/tracklet-public/login.html';
    }
  } catch (e) {
    console.warn('Auth fetch failed:', e.message);
    window.location.href = '/tracklet-public/login.html';
  }

  // Load Data
  loadSettings();
  await renderItems();
  await updateStats();
  await initChart();
  // Hide Loader
  setTimeout(() => {
    loading.style.opacity = '0';
    setTimeout(() => loading.style.display = 'none', 300);
  }, 500);
}
