const { Client } = require('ssh2');
const path = require('path');
const fs = require('fs');

const c = new Client();
const localFile = path.join(__dirname, 'release', 'stdqs.tar.gz');
const remoteFile = '/opt/zjsafe-html/stdqs.tar.gz';
const remoteDir = '/opt/zjsafe-html';
const projectName = 'stdqs';
const nginxConf = '/opt/nginx/conf/nginx.conf';

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
  console.log('[1/5] Connected to server');

  const fileSize = fs.statSync(localFile).size;
  console.log('[2/5] Uploading stdqs.tar.gz (' + (fileSize / 1024).toFixed(0) + ' KB)...');

  const sftp = await new Promise((resolve, reject) => {
    c.sftp((err, sftp) => err ? reject(err) : resolve(sftp));
  });

  await new Promise((resolve, reject) => {
    sftp.fastPut(localFile, remoteFile, (err) => err ? reject(err) : resolve());
  });
  console.log('  Upload complete.');

  // Remove old directory, extract tar.gz, cleanup
  console.log('[3/5] Extracting (replacing old files)...');
  await exec('rm -rf ' + remoteDir + '/' + projectName);
  const ext = await exec('mkdir -p ' + remoteDir + '/' + projectName + ' && tar -xzf ' + remoteFile + ' -C ' + remoteDir + '/' + projectName);
  if (ext.code !== 0) {
    console.error('  Extract failed:', ext.errOut);
    c.end();
    return;
  }
  await exec('rm -f ' + remoteFile);
  const ls = await exec('ls ' + remoteDir + '/' + projectName + ' | head -10');
  console.log('  Extracted to ' + remoteDir + '/' + projectName);
  console.log('  Files: ' + ls.out.trim().replace(/\n/g, ', '));

  // Check nginx config
  console.log('[4/5] Checking nginx config for /' + projectName + ' ...');
  const catRes = await exec('cat ' + nginxConf);
  const confContent = catRes.out;
  const locationPattern = 'location /' + projectName;

  if (confContent.includes(locationPattern)) {
    console.log('  Already exists in nginx.conf. Skipping all nginx operations.');
    console.log('[5/5] No changes needed. Deploy complete!');
    c.end();
    return;
  }

  // Append location block inside the port 81 server block
  console.log('  Not found. Appending location block to port 81 server...');
  const sedCmd = `sed -i '/listen[[:space:]]*81/,/^}/ { /^}/i\\    location /${projectName} {\\n        alias  ${remoteDir}/${projectName};\\n    }' ${nginxConf}`;
  const sedRes = await exec(sedCmd);
  if (sedRes.code !== 0) {
    console.error('  sed failed:', sedRes.errOut);
    c.end();
    return;
  }

  const verifyRes = await exec('grep -A2 "location /' + projectName + '" ' + nginxConf);
  console.log('  Added config:');
  console.log('  ' + verifyRes.out.trim().split('\n').join('\n  '));

  // Reload nginx
  console.log('[5/5] Reloading nginx...');
  const reloadRes = await exec('/opt/nginx/sbin/nginx -s reload');
  if (reloadRes.code !== 0) {
    console.error('  Reload failed:', reloadRes.errOut);
  } else {
    console.log('  Nginx reloaded successfully.');
  }

  console.log('Deploy complete!');
  c.end();
});

c.on('error', (err) => {
  console.error('Connection error:', err.message);
});

c.connect({
  host: '114.107.227.158',
  port: 22,
  username: 'root',
  password: 'Hescah@123'
});
