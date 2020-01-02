const db = require('./models/index');
let people = {};
module.exports = function(server) {
  const io = require('socket.io')(server);
  io.on('connection', (client) => {
    let user;
    console.log('client connected');
    client.on('pickingTeam', (config) => {
      console.log('pickingTeam', config);
    });
    client.on('authenticated', async (config) => {
      user = people[client.id] = config;
      await db.User.updateUser({
        Id: user.Id,
        IsActive: true
      });
      io.emit('userStatusChange', user);
    });
    client.on('disconnect', async () => {
      console.log('client disconnected', user);
      if (user) {
        await db.User.updateUser({
          Id: user.Id,
          IsActive: false
        });
        io.emit('userStatusChange', user);
      }
      delete people[client.id];
    });
  });
  return io;
};