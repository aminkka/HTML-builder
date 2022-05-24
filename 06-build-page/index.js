const fs = require('fs');
const path = require('path');

const pathNewDir = path.join(__dirname, 'project-dist');
const pathAssetsDir = path.join(__dirname, 'assets');
const pathStylesDir = path.join(__dirname, 'styles');

async function initDir(path) {
  fs.mkdir(path, {recursive: true}, err => {
    if (err) return console.error(err.message);
  });
}

async function copyAssetsFiles(pathCopySourse, pathCopyDest) {
  await initDir(pathCopyDest);
  let content = await fs.promises.readdir(pathCopySourse);
  content.forEach((elem) => fs.promises.stat(path.join(pathCopySourse, elem)).then((stats) => {
    if (stats.isDirectory()) {
      (async() => {
        initDir(path.join(pathCopyDest, elem));
        await copyAssetsFiles(path.join(pathCopySourse, elem), path.join(pathCopyDest, elem));
      })();
    } else {
      fs.copyFile(path.join(pathCopySourse, elem), path.join(pathCopyDest, elem), (err) => {
        if (err) throw err;
      });
    }
  }));
}

async function copyFile(nameSourse, nameDest) {
  fs.access(path.join(pathNewDir, nameDest), fs.constants.F_OK, (err) => {
    if (err) {
      fs.copyFile(path.join(__dirname, nameSourse), path.join(pathNewDir, nameDest), (err) => {
        if (err) throw err;
      });
    } else {
      fs.truncate(path.join(pathNewDir, nameDest), err => {
        if(err) throw err;
      });
    }  
  });
}

async function createHTMLFile() {
  const pathHTML = path.join(pathNewDir, 'index.html');
  let innerHTML = (await fs.promises.readFile(path.join(__dirname, 'template.html'))).toString();
  const components = await fs.promises.readdir(path.join(__dirname, 'components'));
  for (let i = 0; i < components.length; i++) {
    let name = components[i].slice(0, components[i].indexOf('.'));
    if (innerHTML.includes(`{{${name}}}`)) {
      innerHTML = innerHTML.replace(`{{${name}}}`, await fs.promises.readFile(path.join(__dirname, 'components', components[i])));
      fs.promises.writeFile(pathHTML, innerHTML.replace(`{{${name}}}`, await fs.promises.readFile(path.join(__dirname, 'components', components[i]))));
    }
  }
}  

function initFile(dirName, fileName) {
  fs.writeFile(path.join(dirName, fileName), '',  err => {
    if (err) throw err;
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
prepareFile(pathNewDir, 'style.css');

async function copyStylesFiles() {
  const data = await fs.promises.readdir(pathStylesDir);
  data.forEach((elem) => fs.promises.stat(path.join(pathStylesDir, elem)).then((stats) => { 
    if (stats.isFile() && path.extname(elem) === '.css') {
      const read = fs.createReadStream(path.join(pathStylesDir, elem), 'utf-8');
      read.on('data', chunk => fs.appendFile(path.join(pathNewDir, 'style.css'), chunk, (err) => { 
        if (err) throw err;}));
    }
  }
  ));
}

(async() => {
  await initDir(pathNewDir);
  await copyFile('template.html', 'index.html');
  await createHTMLFile();
  await copyStylesFiles();
  await copyAssetsFiles(pathAssetsDir, path.join(pathNewDir, 'assets'));
})();
