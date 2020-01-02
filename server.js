require('dotenv').config();
const ip = require('ip');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('./sockets')(server);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + process.env.UI_DIR));
require('./controllers/index')(app, io);
server.listen(process.env.PORT, () => {
  console.log('running on', process.env.PORT, ip.address());
});