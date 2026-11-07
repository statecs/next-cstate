require('dotenv').config({ path: '.env.production' });
const fs = require('fs');
const path = require('path');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const localDir = process.cwd();
const remoteDir = '/var/www/cstate.se/portfolio';
const pm2Name = 'portfolio-prod';
const healthUrl = 'http://localhost:3000/home';

// Folders the server should mirror exactly. Files in them that no longer exist
// locally are deleted, so a removed or renamed module can't break the build.
const mirroredDirs = ['src', 'public'];

const isUploaded = (itemPath) =>
    !itemPath.includes('node_modules') && !itemPath.includes('.git') && !itemPath.includes('.next') && !itemPath.includes('.data');

const shellQuote = (s) => `'${s.replace(/'/g, `'\\''`)}'`;

// Runs a command on the server and throws if it exits non-zero, so a failed
// step stops the deploy instead of restarting the site on a broken build.
async function run(label, command) {
    console.log(`\n> ${label}`);
    const result = await ssh.execCommand(command, { cwd: remoteDir });
    if (result.stdout) console.log(result.stdout);
    if (result.stderr) console.error(result.stderr);
    if (result.code !== 0) {
        throw new Error(`${label} failed (exit ${result.code})`);
    }
    return result;
}

function listLocalFiles(dir) {
    const out = [];
    const walk = (rel) => {
        for (const entry of fs.readdirSync(path.join(localDir, rel), { withFileTypes: true })) {
            const relPath = path.posix.join(rel, entry.name);
            if (!isUploaded(path.join(localDir, relPath))) continue;
            if (entry.isDirectory()) walk(relPath);
            else out.push(relPath);
        }
    };
    if (fs.existsSync(path.join(localDir, dir))) walk(dir);
    return out;
}

async function removeStaleFiles() {
    const local = new Set(mirroredDirs.flatMap(listLocalFiles));
    const { stdout } = await run('List server files', `find ${mirroredDirs.join(' ')} -type f 2>/dev/null || true`);
    const remote = stdout.split('\n').map((l) => l.trim()).filter(Boolean);
    const stale = remote.filter((f) => !local.has(f));

    if (stale.length === 0) {
        console.log('No stale files on the server.');
        return;
    }
    // Guard against a bad local listing wiping the server's source tree.
    if (stale.length > remote.length / 2) {
        throw new Error(`Refusing to delete ${stale.length} of ${remote.length} server files; check the local checkout.`);
    }
    console.log(`Removing ${stale.length} stale file(s):\n  ${stale.join('\n  ')}`);
    await run('Remove stale files', `rm -f -- ${stale.map(shellQuote).join(' ')}`);
    await run('Remove empty folders', `find ${mirroredDirs.join(' ')} -type d -empty -delete 2>/dev/null || true`);
}

const healthCheck = `node -e "const go=n=>fetch('${healthUrl}',{redirect:'manual'}).then(r=>{if(r.status>=500)throw new Error('HTTP '+r.status);console.log('HTTP',r.status)}).catch(e=>n>0?setTimeout(()=>go(n-1),2000):(console.error(e.message),process.exit(1)));go(15)"`;

async function restart() {
    await run('Stop old process', `pm2 delete ${pm2Name} || true`);
    await run('Start new process', 'pm2 start ecosystem.config.js');
}

async function deploy() {
    let swapped = false;
    try {
        await ssh.connect({
            host: process.env.SFTP_HOST,
            port: process.env.SFTP_PORT || '22',
            username: process.env.SFTP_USERNAME,
            password: process.env.SFTP_PASSWORD
        });

        console.log('Starting upload...');
        const failed = [];
        await ssh.putDirectory(localDir, remoteDir, {
            recursive: true,
            tick: (localPath, remotePath, error) => {
                if (error) failed.push(localPath);
            },
            validate: isUploaded
        });
        if (failed.length) throw new Error(`Upload failed for ${failed.length} file(s):\n  ${failed.join('\n  ')}`);
        console.log('Upload complete');

        await removeStaleFiles();
        await run('Install dependencies', 'npm install');

        // Build into .next-build so the live .next keeps serving until the new
        // build is known to be good. Reuse the build cache (it also holds the
        // downloaded Google Fonts).
        // tsconfig type-checks .next/types and any **/*.ts, so generated types
        // from the live or previous build would still point at deleted files.
        // They are only used for type checking, never at runtime.
        await run('Clear old generated types', 'rm -rf .next/types .next-prev .next-failed');
        await run(
            'Build',
            'rm -rf .next-build && mkdir .next-build && ([ -d .next/cache ] && cp -R .next/cache .next-build/cache || true) && NEXT_DIST_DIR=.next-build npm run build'
        );
        await run('Check build output', 'test -s .next-build/BUILD_ID && cat .next-build/BUILD_ID');

        await run('Swap in new build', 'rm -rf .next-prev && ([ -d .next ] && mv .next .next-prev || true) && mv .next-build .next');
        swapped = true;
        await restart();

        try {
            await run('Health check', healthCheck);
        } catch (err) {
            console.error('New build is not responding, rolling back to the previous build.');
            await run('Roll back', 'test -d .next-prev && rm -rf .next-failed && mv .next .next-failed && mv .next-prev .next');
            await restart();
            await run('Health check after rollback', healthCheck);
            throw err;
        }
        await run('Save PM2 process list', 'pm2 save');

        // Clear the server's Contentful cache and revalidate all paths so new content shows immediately
        const baseUrl = (process.env.NEXT_PUBLIC_URL || 'https://cstate.se').replace(/\/$/, '');
        const secret = process.env.CONTENTFUL_WEBHOOK_SECRET;
        if (!secret) {
            console.warn('Skipping cache revalidation: CONTENTFUL_WEBHOOK_SECRET is not set.');
        } else {
            try {
                console.log(`Revalidating cache at ${baseUrl}/api/revalidate ...`);
                const res = await fetch(`${baseUrl}/api/revalidate`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${secret}` }
                });
                const body = await res.text();
                if (res.ok) {
                    console.log('Cache revalidated:', body);
                } else {
                    console.error(`Cache revalidation failed (HTTP ${res.status}):`, body);
                }
            } catch (revalErr) {
                console.error('Cache revalidation request errored:', revalErr.message || revalErr);
            }
        }
        console.log('\nDeploy complete.');
    } catch (err) {
        console.error('\nDeploy failed:', err.message || err);
        console.error(swapped ? 'Check the health check output above.' : 'The live site was not touched.');
        process.exitCode = 1;
    } finally {
        ssh.dispose();
    }
}

deploy();
