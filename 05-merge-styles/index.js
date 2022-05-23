const path = require('path');
const fs = require('fs');

const pathSourseDir = path.join(__dirname, 'styles');
const pathDestDir = path.join(__dirname, 'project-dist');

function initFile(dirName, fileName) {
  fs.writeFile(path.join(dirName, fileName), '',  err => {
    if (err) throw err;
    console.log(`File ${fileName} was created`);
  });
}

function prepareFile(dirName, fileName) {
  fs.access(path.join(dirName, fileName), fs.constants.F_OK, (err) => {
    if (err) initFile(dirName, fileName);
    fs.truncate(path.join(dirName, fileName), err => {
      if(err) throw err;
    });
  }); 
}
prepareFile(pathDestDir, 'bundle.css');

async function copyFiles() {
  const data = await fs.promises.readdir(pathSourseDir);
  data.forEach((elem) => fs.promises.stat(path.join(pathSourseDir, elem)).then((stats) => { 
    if (stats.isFile() && path.extname(elem) === '.css') {
      const read = fs.createReadStream(path.join(pathSourseDir, elem), 'utf-8');
      read.on('data', chunk => fs.appendFile(path.join(pathDestDir, 'bundle.css'), chunk, (err) => { 
        if (err) throw err;}));
    }
  }
  ));
}
copyFiles();
