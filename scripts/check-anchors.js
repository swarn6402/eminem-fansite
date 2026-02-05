const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const idMatches = [...html.matchAll(/\bid="([^"]+)"/g)];
const ids = new Set(idMatches.map((match) => match[1]));

const anchorMatches = [...html.matchAll(/<a[^>]*href="#([^"]+)"/g)];
const missing = [];

anchorMatches.forEach((match) => {
  const targetId = match[1];
  if (!ids.has(targetId)) {
    missing.push(targetId);
  }
});

if (missing.length > 0) {
  console.error(`Missing anchor targets: ${[...new Set(missing)].join(', ')}`);
  process.exit(1);
}

console.log('All in-page anchor targets exist.');
