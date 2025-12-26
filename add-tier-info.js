const fs = require('fs');
let html = fs.readFileSync('dashboard.html', 'utf8');

// 1. Add tier badge CSS styles after .status-dot definition
const tierStyles = `
    /* Tier Badges */
    .tier-badge {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .tier-free { background: rgba(148, 163, 184, 0.15); color: var(--gray-600); }
    .tier-trial { background: rgba(245, 158, 11, 0.15); color: var(--warning); }
    .tier-professional { background: rgba(37, 99, 235, 0.15); color: var(--primary); }
    .tier-enterprise { background: rgba(139, 92, 246, 0.15); color: var(--accent); }
    
    [data-theme="dark"] .tier-free { color: var(--gray-400); }
    
    .trial-info {
      font-size: 0.75rem;
      color: var(--warning);
      font-weight: 500;
      margin-top: 0.25rem;
    }`;

const statusDotIndex = html.indexOf('.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }');
if (statusDotIndex > -1) {
  const insertPoint = html.indexOf('\n', statusDotIndex) + 1;
  html = html.substring(0, insertPoint) + tierStyles + '\n' + html.substring(insertPoint);
  console.log('✓ Added tier badge CSS styles');
}

// 2. Update the user profile section HTML to include tier badge and trial info
const oldUserProfile = `    <div class="user-profile">
      <div class="avatar" id="sidebarAvatar">U</div>
      <div style="flex:1; overflow:hidden;">
        <div style="font-weight:600; font-size:0.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" id="sidebarName">User</div>
        <div style="font-size:0.8rem; color:var(--text-secondary);">Free Plan</div>
      </div>
      <button class="btn-icon" id="logoutBtn" title="Logout">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"></path></svg>
      </button>
    </div>`;

const newUserProfile = `    <div class="user-profile">
      <div class="avatar" id="sidebarAvatar">U</div>
      <div style="flex:1; overflow:hidden;">
        <div style="font-weight:600; font-size:0.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" id="sidebarName">User</div>
        <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.25rem;">
          <span class="tier-badge tier-free" id="tierBadge">FREE</span>
        </div>
        <div class="trial-info" id="trialInfo" style="display:none;"></div>
      </div>
      <button class="btn-icon" id="logoutBtn" title="Logout">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"></path></svg>
      </button>
    </div>`;

html = html.replace(oldUserProfile, newUserProfile);
console.log('✓ Updated user profile HTML with tier badge');

// 3. Update initApp function to include tier logic
const oldInitApp = html.substring(
  html.indexOf('    async function initApp() {'),
  html.indexOf('      loadSettings();')
);

const newInitApp = `    async function initApp() {
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
          
          // Display tier info
          const tier = user.subscriptionTier || 'free';
          const tierBadge = document.getElementById('tierBadge');
          tierBadge.textContent = tier.toUpperCase();
          tierBadge.className = 'tier-badge tier-' + tier;
          
          // Show trial countdown if applicable
          const trialInfo = document.getElementById('trialInfo');
          if (tier === 'trial' && user.trialEndsAt) {
            const trialEnds = new Date(user.trialEndsAt);
            const daysLeft = Math.ceil((trialEnds - Date.now()) / (1000 * 60 * 60 * 24));
            
            if (daysLeft > 0) {
              trialInfo.textContent = 'Trial ends in ' + daysLeft + ' day' + (daysLeft === 1 ? '' : 's');
              trialInfo.style.display = 'block';
            } else {
              trialInfo.textContent = 'Trial expired';
              trialInfo.style.display = 'block';
            }
          } else {
            trialInfo.style.display = 'none';
          }
        } else {
          window.location.href = '/tracklet-public/login.html';
        }
      } catch (e) {
        window.location.href = '/tracklet-public/login.html';
      }

      `;

html = html.replace(oldInitApp, newInitApp);
console.log('✓ Updated initApp function with tier display logic');

// Write the updated file
fs.writeFileSync('dashboard.html', html);
console.log('\n✅ Dashboard updated successfully with subscription tier info!');
