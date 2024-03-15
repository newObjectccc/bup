const fs = require('fs');

function readdirToString(dirPath) {
  const result = [];
  try {
    const files = fs.readdirSync(dirPath);
    result[0] = files.join(',');
  } catch (error) {
    result[1] = error;
  }
  return result;
}

module.exports = readdirToString;
