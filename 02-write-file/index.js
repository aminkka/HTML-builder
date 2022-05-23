const process = require('process');
const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

fs.writeFile(path.join(__dirname, 'text.txt'), '', 
  (err) => {
    if (err) throw err;
    stdout.write('Please leave your messages\n');
  });

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  } else {
    fs.appendFile(
      path.join(__dirname, 'text.txt'),
      `${data}`,
      (err) => {
        if (err) throw err;
      }
    );
  }
});
process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('\nThank you for your message!\n'));

