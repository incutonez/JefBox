const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: config.dialect,
  storage: config.storage,
  define: {
    timestamps: false
  },
  dialectOptions: {
    // for reading from database
    useUTC: false
  }
});
let db = {
  conn: sequelize,
  orm: Sequelize
};

fs.readdirSync(__dirname).filter(file => {
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
}).forEach(file => {
  const model = db.conn['import'](path.join(__dirname, file));
  if (model) {
    db[model.name] = model;
  }
});

for (let key in db) {
  let model = db[key];
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
}

db.conn.sync().then(() => {
  console.log('synced');
}).catch((err) => {
  console.log(err);
});

module.exports = db;
