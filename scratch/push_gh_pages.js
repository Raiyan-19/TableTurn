const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const distDir = path.join(__dirname, '..', 'client', 'dist');

console.log('Deploying client/dist to gh-pages branch...');

// Ensure index.html exists
if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('client/dist/index.html not found! Run npm run build first.');
  process.exit(1);
}

// Add a .nojekyll file to prevent Jekyll processing on GitHub Pages
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

// Copy index.html to 404.html for SPA routing on GitHub Pages
fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));

try {
  // Initialize git inside distDir
  execSync('git init', { cwd: distDir, stdio: 'inherit' });
  execSync('git config user.name "Raiyan-19"', { cwd: distDir, stdio: 'inherit' });
  execSync('git config user.email "raiyan@tableturn.dev"', { cwd: distDir, stdio: 'inherit' });
  execSync('git checkout -B gh-pages', { cwd: distDir, stdio: 'inherit' });
  execSync('git add -A', { cwd: distDir, stdio: 'inherit' });
  execSync('git commit -m "deploy: automated build to GitHub Pages"', { cwd: distDir, stdio: 'inherit' });
  
  // Get remote URL from main repo
  const remoteUrl = execSync('git config --get remote.origin.url', { cwd: path.join(__dirname, '..') }).toString().trim();
  console.log('Pushing to remote:', remoteUrl);
  
  execSync(`git push -f ${remoteUrl} gh-pages`, { cwd: distDir, stdio: 'inherit' });
  console.log('Successfully published to gh-pages branch!');
} catch (err) {
  console.error('Error during deploy:', err.message);
  process.exit(1);
}
