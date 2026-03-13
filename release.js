require('dotenv').config({ path: '.env.production' });
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const localDir = process.cwd();
const remoteDir = '/var/www/cstate.se/portfolio';

async function deploy() {
 try {
   await ssh.connect({
     host: process.env.SFTP_HOST,
     port: process.env.SFTP_PORT || '22',
     username: process.env.SFTP_USERNAME,
     password: process.env.SFTP_PASSWORD
   });

   console.log('Starting upload...');
   await ssh.putDirectory(localDir, remoteDir, {
     recursive: true,
     tick: (localPath, remotePath, error) => {
       if (error) console.error(`Failed to upload ${localPath}`, error);
     },
     validate: (itemPath) => !itemPath.includes('node_modules') && !itemPath.includes('.git') && !itemPath.includes('.next')
   });
   console.log('Upload complete');

   // Execute remote commands
   let result;
   
   console.log('Installing dependencies...');
   result = await ssh.execCommand('npm install', { cwd: remoteDir });
   if (result.stdout) console.log('Build stdout:', result.stdout);
   if (result.stderr) console.error('Build stderr:', result.stderr);

   console.log('Building...');
   result = await ssh.execCommand('npm run build', { cwd: remoteDir });
   if (result.stdout) console.log('Build stdout:', result.stdout);
   if (result.stderr) console.error('Build stderr:', result.stderr);

   console.log('Updating PM2...');
   result = await ssh.execCommand('pm2 delete portfolio-prod || true', { cwd: remoteDir });
   if (result.stdout) console.log('PM2 delete stdout:', result.stdout);

   result = await ssh.execCommand('pm2 start ecosystem.config.js', { cwd: remoteDir });
   if (result.stdout) console.log('PM2 start stdout:', result.stdout);

   result = await ssh.execCommand('pm2 save', { cwd: remoteDir });
   if (result.stdout) console.log('PM2 save stdout:', result.stdout);

   // Verify deployment
   console.log('Verifying deployment...');
   result = await ssh.execCommand('cat .next/BUILD_ID', { cwd: remoteDir });
   const buildId = result.stdout.trim();
   console.log('Deployed BUILD_ID:', buildId);

   // Wait for PM2 to start
   await new Promise(resolve => setTimeout(resolve, 3000));

   result = await ssh.execCommand('pm2 logs portfolio-prod --lines 10 --nostream', { cwd: remoteDir });
   console.log('PM2 startup logs:\n', result.stdout);

 } catch (err) {
   console.error('Error:', err);
   process.exit(1);
 } finally {
   ssh.dispose();
 }
}

deploy();