const { Client } = require('ssh2');
const path = require('path');
const fs = require('fs');

const c = new Client();
let totalPending = 0;
let totalFiles = 0;
let uploadedFiles = 0;

function countFiles(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const lp = path.join(dir, item);
    if (fs.statSync(lp).isDirectory()) countFiles(lp);
    else totalFiles++;
  }
}

c.on('ready', () => {
  console.log('Connected to server');
  
  const localDir = path.join(__dirname, 'dist');
  const remoteDir = '/opt/zjsafe-html/stdqs';
  
  countFiles(localDir);
  console.log('Found ' + totalFiles + ' files to upload');
  
  c.sftp((e, sftp) => {
    if (e) { console.error('SFTP error:', e); c.end(); return; }

    function mkdirp(remotePath) {
      try { sftp.mkdirSync(remotePath); } catch (ex) { /* exists */ }
    }

    function uploadDir(local, remote) {
      mkdirp(remote);
      const items = fs.readdirSync(local);
      for (const item of items) {
        const lp = path.join(local, item);
        const rp = remote + '/' + item;
        if (fs.statSync(lp).isDirectory()) {
          uploadDir(lp, rp);
        } else {
          totalPending++;
          sftp.fastPut(lp, rp, (err) => {
            if (err) console.error('Upload error:', lp, err);
            uploadedFiles++;
            if (uploadedFiles % 10 === 0 || uploadedFiles === totalFiles) {
              console.log('Progress: ' + uploadedFiles + '/' + totalFiles);
            }
            totalPending--;
            if (totalPending === 0) {
              console.log('All files uploaded. Reloading nginx...');
              c.exec('/opt/nginx/sbin/nginx -s reload', (execErr, execStream) => {
                if (execErr) { console.error('Exec error:', execErr); c.end(); return; }
                let execOut = '';
                execStream.on('data', d => execOut += d);
                execStream.stderr.on('data', d => execOut += d);
                execStream.on('close', () => {
                  console.log('Nginx reloaded:', execOut || 'OK');
                  console.log('Deploy complete!');
                  c.end();
                });
              });
            }
          });
        }
      }
    }

    // Create parent directories first
    mkdirp('/opt/zjsafe-html');
    mkdirp('/opt/zjsafe-html/stdqs');
    mkdirp(remoteDir);
    
    uploadDir(localDir, remoteDir);
  });
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
