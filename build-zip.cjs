const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const releaseDir = path.join(__dirname, 'release');
if (!fs.existsSync(releaseDir)) fs.mkdirSync(releaseDir, { recursive: true });

const output = fs.createWriteStream(path.join(releaseDir, 'stdqs.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log('Zip created: ' + archive.pointer() + ' bytes');
});
archive.on('error', (err) => { throw err; });
archive.pipe(output);
archive.directory('dist/', false);
archive.finalize();
