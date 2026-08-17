const { Client } = require('ssh2');
const path = require('path');
const fs = require('fs');

const c = new Client();
const localFile = path.join(__dirname, 'release', 'stdqs.zip');
const remoteFile = '/opt/zjsafe-html/stdqs.zip';
const remoteDir = '/opt/zjsafe-html';
const projectName = 'stdqs';

function exec(cmd) {
  return new Promise((resolve, reject) => {
    c.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '', errOut = '';
      stream.on('data', d => out += d);
      stream.stderr.on('data', d => errOut += d);
      stream.on('close', (code) => resolve({ code, out, errOut }));
    });
  });
}

c.on('ready', async () => {
  console.log('[1/4] Connected to server');

  const fileSize = fs.statSync(localFile).size;
  console.log('[2/4] Uploading stdqs.zip (' + (fileSize / 1024).toFixed(0) + ' KB)...');

  const sftp = await new Promise((resolve, reject) => {
    c.sftp((err, sftp) => err ? reject(err) : resolve(sftp));
  });

  await new Promise((resolve, reject) => {
    sftp.fastPut(localFile, remoteFile, (err) => err ? reject(err) : resolve());
  });
  console.log('  Upload complete.');

  // Remove old directory, extract zip, cleanup
  console.log('[3/4] Extracting (replacing old files)...');
  await exec('rm -rf ' + remoteDir + '/' + projectName);
  await exec('mkdir -p ' + remoteDir + '/' + projectName);
  const unzipCmd = 'cd ' + remoteDir + '/' + projectName + ' && unzip -o ' + remoteFile;
  const ext = await exec(unzipCmd);
  // unzip may return warning about backslashes but still succeed
  if (ext.code !== 0 && !ext.out.includes('inflating:')) {
    console.error('  Unzip failed:', ext.errOut);
    console.error('  Output:', ext.out);
    c.end();
    return;
  }
  console.log('  Extracted successfully (ignoring backslash warnings)');
  await exec('rm -f ' + remoteFile);
  const ls = await exec('ls ' + remoteDir + '/' + projectName + ' | head -10');
  console.log('  Extracted to ' + remoteDir + '/' + projectName);
  console.log('  Files: ' + ls.out.trim().replace(/\n/g, ', '));

  // Reload nginx
  console.log('[4/4] Reloading nginx...');
  const reloadRes = await exec('/opt/nginx/sbin/nginx -s reload');
  if (reloadRes.code !== 0) {
    console.error('  Reload failed:', reloadRes.errOut);
  } else {
    console.log('  Nginx reloaded successfully.');
  }

  console.log('\n✅ Deploy complete! Access at: http://114.107.227.158:81/stdqs/');
  c.end();
});

c.on('error', (err) => {
  console.error('❌ Connection error:', err.message);
});

c.connect({
  host: '114.107.227.158',
  port: 22,
  username: 'root',
  password: 'Hescah@123'
});
