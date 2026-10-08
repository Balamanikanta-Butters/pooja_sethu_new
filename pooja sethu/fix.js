const fs = require('fs');
let data = fs.readFileSync('src/app/booking/muhurtham.tsx', 'utf8');
data = data.replace(
  /selectedMuhurtham:\s*selectedMuhurtham\s*===\s*'custom'\s*\?\s*`\$\{customDate\}\s*\$\{customTime\}`\s*:\s*selectedMuhurtham,/,
  `selectedMuhurtham: selectedMuhurtham === 'custom' ? \`\${customDate} \${customTime}\` : (selectedMuhurtham === '11' ? 'Sun, 11 Oct · 7:12 – 9:04 AM' : (selectedMuhurtham === '22' ? 'Thu, 22 Oct · 7:10 – 8:52 AM' : (selectedMuhurtham === '25' ? 'Sun, 25 Oct · 6:40 – 8:15 AM' : selectedMuhurtham))),`
);
fs.writeFileSync('src/app/booking/muhurtham.tsx', data);
