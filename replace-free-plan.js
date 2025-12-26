const fs = require('fs');
let html = fs.readFileSync('dashboard.html', 'utf8');

// Simple string replacement
html = html.replace(
  '<div style="font-size:0.8rem; color:var(--text-secondary);">Free Plan</div>',
  '<div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.25rem;"><span class="tier-badge tier-free" id="tierBadge">FREE</span></div>\n        <div class="trial-info" id="trialInfo" style="display:none;"></div>'
);

fs.writeFileSync('dashboard.html', html);
console.log('✅ Replaced Free Plan with tier badge');
