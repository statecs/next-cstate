require('dotenv').config({ path: '.env.production' });
const fs = require('fs').promises;
const path = require('path');
const { NodeSSH } = require('node-ssh');
const SftpClient = require('ssh2-sftp-client');
const sftp = new SftpClient();
const ssh = new NodeSSH();

const localDir = process.cwd();
const remoteDir = '/var/www/dev.cstate.se';
const exclude = ['node_modules', '.git', '.next'];

/**
 * Uploads a directory to a remote location, excluding specified directories or files.
 * 
 * @param {string} localDir - The local directory to upload.
 * @param {string} remoteDir - The remote directory to upload to.
 */
async function uploadDirWithExclusion(localDir, remoteDir) {
  const files = await fs.readdir(localDir);

  for (const fileName of files) {
    if (exclude.includes(fileName)) {
      continue;
    }

    const localFilePath = path.join(localDir, fileName);
    const remoteFilePath = path.join(remoteDir, fileName);
    const stats = await fs.stat(localFilePath);

    if (stats.isDirectory()) {
      await sftp.mkdir(remoteFilePath, true).catch(console.error);
      await uploadDirWithExclusion(localFilePath, remoteFilePath);
    } else {
      await sftp.put(localFilePath, remoteFilePath).catch(console.error);
    }
  }
}

/**
 * Connects to a remote server via SFTP and SSH, uploads a directory excluding certain files or directories,
 * and executes a series of commands remotely.
 */
async function uploadAndExecuteCommands() {
  try {
    await sftp.connect({
      host: process.env.SFTP_HOST,
      port: process.env.SFTP_PORT || '22',
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
    });

    console.log(`Starting upload from ${localDir} to ${remoteDir}`);
    await uploadDirWithExclusion(localDir, remoteDir);
    console.log('Upload completed successfully');
    await sftp.end();

    await ssh.connect({
      host: process.env.SFTP_HOST,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
    });

    let result = await ssh.execCommand('npm install', { cwd: remoteDir });
    if (result.stdout) console.log('Build stdout:', result.stdout);
    if (result.stderr) console.error('Build stderr:', result.stderr);

    result = await ssh.execCommand('npm run build', { cwd: remoteDir });
    if (result.stdout) console.log('Build stdout:', result.stdout);
    if (result.stderr) console.error('Build stderr:', result.stderr);

    result = await ssh.execCommand('pm2 delete portfolio-dev || true', { cwd: remoteDir });
    if (result.stdout) console.log('PM2 delete stdout:', result.stdout);

    result = await ssh.execCommand('pm2 start ecosystem.dev.config.js', { cwd: remoteDir });
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

    result = await ssh.execCommand('pm2 logs portfolio-dev --lines 10 --nostream', { cwd: remoteDir });
    console.log('PM2 startup logs:\n', result.stdout);

  } catch (err) {
    console.error('Error during the process:', err);
  } finally {
    ssh.dispose();
  }
}

uploadAndExecuteCommands();
