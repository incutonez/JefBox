const db = require('./models/index');
const people = {};
module.exports = function(server) {
  const io = require('socket.io')(server);
  io.on('connection', (client) => {
    let user;
    const clientId = client.id;
    console.log('client connected');
    client.on('setUser', async (config) => {
      user = people[clientId] = config;
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
      delete people[clientId];
    });
  });
  return io;
};