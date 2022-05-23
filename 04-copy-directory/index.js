const fs = require('fs');
const path = require('path');

async function initDir(nameDest) {
  const dest = path.join(__dirname, nameDest);
  fs.mkdir(dest,{recursive: true}, err => {
    if (err) return console.error(err.message);
  });
}

async function createCopyOfDir(nameDest) {
  const dest = path.join(__dirname, nameDest);
  fs.readdir(dest, (err, data) => {
    if (err) throw err;
    data.forEach((elem) => 
      fs.unlink(path.join(dest, elem), (err) => {
        if (err) return console.error(err.message);
      })
    );
  }); 
}

async function copyFiles(nameSourse, nameDest) {
  const dest = path.join(__dirname, nameDest);
  const sourse = path.join(__dirname, nameSourse);
  fs.readdir(sourse, (err, data) => {
    if (err) throw err;
    data.forEach((elem) => 
      fs.copyFile(path.join(sourse, elem), path.join(dest, elem), (err) => {
        if (err) return console.error(err.message);
      })
    );
  }); 
}

(async() => {
  await initDir('files-copy');
  await createCopyOfDir('files-copy');
  await copyFiles('files', 'files-copy');
})();