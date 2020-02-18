require('dotenv').config();
const ip = require('ip');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('./sockets')(server);
app.use(bodyParser.json())
.use(bodyParser.urlencoded({extended: true}))
// $env:NODE_ENV="production" for seeding
.use(express.static(process.env.NODE_ENV === 'production' ? `${__dirname}${process.env.UI_DIR_PROD}` : `${__dirname}${process.env.UI_DIR}`));
require('./controllers/index')(app, io);
server.listen(process.env.PORT, () => {
  console.log('running on', process.env.PORT, ip.address());
});