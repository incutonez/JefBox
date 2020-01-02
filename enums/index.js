const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
let enums = {};

fs.readdirSync(__dirname).filter(file => {
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
}).forEach(file => {
  const enumClass = require(path.join(__dirname, file));
  const key = path.basename(file, '.js');
  if (enumClass) {
    enums[key] = enumClass;
  }
});

module.exports = enums;