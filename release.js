require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const SftpClient = require('ssh2-sftp-client');
const sftp = new SftpClient();

const localDir = process.cwd(); // Current working directory
const remoteDir = '/var/www/cstate.se/portfolio'; // Destination directory on the server
const exclude = ['node_modules', '.git', '.next']; // Directories to exclude

async function uploadDirWithExclusion(localDir, remoteDir) {
  const files = await fs.readdir(localDir);

  for (const fileName of files) {
    if (exclude.includes(fileName)) {
      continue; // Skip excluded files/directories
    }

    const localFilePath = path.join(localDir, fileName);
    const remoteFilePath = path.join(remoteDir, fileName);
    const stats = await fs.stat(localFilePath);

    if (stats.isDirectory()) {
      // If it's a directory, create it on the remote server and recurse into it
      await sftp.mkdir(remoteFilePath, true).catch(console.error);
      await uploadDirWithExclusion(localFilePath, remoteFilePath);
    } else {
      // If it's a file, upload it
      await sftp.put(localFilePath, remoteFilePath).catch(console.error);
    }
  }
}

async function upload() {
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
  } catch (err) {
    console.error('Error during the upload process:', err);
  } finally {
    await sftp.end();
  }
}

upload();
