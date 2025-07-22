// run-k6-all.js
const { execSync } = require('child_process');
const { readdirSync } = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const testFiles = readdirSync(distDir).filter(file => file.endsWith('.js'));

if (testFiles.length === 0) {
  console.error('No test files found in dist/');
  process.exit(1);
}

for (const file of testFiles) {
  const fullPath = path.join(distDir, file);
  console.log(`\n Running test: ${file}`);
  try {
    execSync(`k6 run "${fullPath}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error(` Test failed: ${file}`);
    process.exit(1);
  }
}
s