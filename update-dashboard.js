const fs = require('fs');
let code = fs.readFileSync('dashboard.html', 'utf8');

// Find and replace the initApp function
const start = code.indexOf('    async function initApp()');
const end = code.indexOf('    // Navigation', start);

if (start > -1 && end > -1) {
  const newFunc = `    async function initApp() {
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
          
          const name = user.name || user.email || 'User';
          document.getElementById('sidebarName').textContent = name;
          
          const avatarEl = document.getElementById('sidebarAvatar');
          if (user.picture) {
            avatarEl.style.backgroundImage = 'url(' + user.picture + ')';
            avatarEl.style.backgroundSize = 'cover';
            avatarEl.style.backgroundPosition = 'center';
            avatarEl.style.fontSize = '0';
            avatarEl.textContent = '';
          } else {
            avatarEl.textContent = name.charAt(0).toUpperCase();
          }
        } else {
          window.location.href = '/tracklet-public/login.html';
        }
      } catch (e) {
        window.location.href = '/tracklet-public/login.html';
      }

      loadSettings();
      renderItems();
      initChart();
      
      setTimeout(() => {
        loading.style.opacity = '0';
        setTimeout(() => loading.style.display = 'none', 300);
      }, 500);
    }

    `;
  
  code = code.substring(0, start) + newFunc + code.substring(end);
  fs.writeFileSync('dashboard.html', code);
  console.log('Updated initApp function successfully');
} else {
  console.log('Could not find initApp function');
  console.log('Start:', start, 'End:', end);
}
