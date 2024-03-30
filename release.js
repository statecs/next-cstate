require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { NodeSSH } = require('node-ssh');
const SftpClient = require('ssh2-sftp-client');
const sftp = new SftpClient();
const ssh = new NodeSSH();

const localDir = process.cwd();
const remoteDir = '/var/www/cstate.se/portfolio';
const exclude = ['node_modules', '.git', '.next'];

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

    result = await ssh.execCommand('npm run start', { cwd: remoteDir });
    if (result.stdout) console.log('Start stdout:', result.stdout);
    if (result.stderr) console.error('Start stderr:', result.stderr);

  } catch (err) {
    console.error('Error during the process:', err);
  } finally {
    ssh.dispose();
  }
}

uploadAndExecuteCommands();
