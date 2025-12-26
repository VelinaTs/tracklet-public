const fs = require('fs');
let html = fs.readFileSync('dashboard.html', 'utf8');

// Update the user-profile section
const oldProfile = `    <div class="user-profile">
      <div class="avatar" id="sidebarAvatar">U</div>
      <div style="flex:1; overflow:hidden;">
        <div style="font-weight:600; font-size:0.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" id="sidebarName">User</div>
        <div style="font-size:0.8rem; color:var(--text-secondary);">Free Plan</div>
      </div>
      <button class="btn-icon" id="logoutBtn" title="Logout">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"></path></svg>
      </button>
    </div>`;

const newProfile = `    <div class="user-profile">
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

html = html.replace(oldProfile, newProfile);

fs.writeFileSync('dashboard.html', html);
console.log('✅ Updated user-profile HTML with tier badge and trial info');
