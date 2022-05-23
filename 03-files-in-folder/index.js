const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, inside) => {
  if (err) console.log(err);
  const files = inside.filter((file) => file.isFile());
  files.forEach((file) => { 
    fs.stat(path.join(__dirname, 'secret-folder', `${file.name}`), (err, stats) => { 
      let fileSize = stats.size;
      console.log(`${file.name.slice(0, file.name.indexOf('.'))} - ${path.extname(file.name).slice(1)} - ${fileSize}b`);
    });
  });
});