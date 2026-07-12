const fs = require('fs');
const paths = [
  'c:/Users/shaik/New folder (2)/SentinelOps-AI/package-lock.json',
  'c:/Users/shaik/New folder (2)/SentinelOps-AI/backend/package-lock.json',
];

for (const p of paths) {
  try {
    const txt = fs.readFileSync(p, 'utf8');
    JSON.parse(txt);
    console.log(`${p}: OK`);
  } catch (e) {
    console.error(`${p}: INVALID JSON -> ${e.message}`);
    process.exitCode = 1;
  }
}
