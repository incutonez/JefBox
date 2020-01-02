/**
 * When this gets required is key... it used be required in Application.js, but that caused issues with models and
 * stores loading before they should, and I couldn't use defaultValue in model definitions.  Now, this class is
 * required from the respective MainView, and when that happens, this requires the stores, which requires their models,
 * and allows for us to use Enums
 */
Ext.define('JefBox.Socket', {
  singleton: true,
  alternateClassName: [
    'socket'
  ],
  requires: [
    'JefBox.store.Teams',
    'JefBox.store.Games',
    'JefBox.store.Users',
    'JefBox.store.Uploads'
  ],

  config: {
    connection: null
  },

  constructor: function(config) {
    if (window.io) {
      this.setConnection(io());
      this.setUpStoreListeners();
      this.emit('authenticated', UserProfile.getData());
    }
  },

  on: function(event, handler) {
    let connection = this.getConnection();
    if (connection) {
      connection.on(event, handler);
    }
  },

  off: function(event, handler) {
    let connection = this.getConnection();
    if (connection) {
      connection.off(event, handler);
    }
  },

  emit: function(id, message) {
    let connection = this.getConnection();
    if (connection) {
      connection.emit(id, message);
    }
  },

  setUpStoreListeners: function() {
    let me = this;
    let users = JefBox.store.Users;
    let teams = JefBox.store.Teams;
    let games = JefBox.store.Games;
    let uploads = JefBox.store.Uploads;
    me.off('userStatusChange');
    me.off('updatedTeams');
    me.off('updatedUsers');
    me.off('updatedGames');
    me.off('updatedUploads');
    me.on('updatedTeams', function() {
      teams.load();
      users.load();
    });
    me.on('updatedUsers', function() {
      users.load();
      teams.load();
    });
    me.on('userStatusChange', function() {
      users.load();
      if (!games.isLoaded()) {
        games.load();
      }
      if (!teams.isLoaded()) {
        teams.load();
      }
      if (!uploads.isLoaded()) {
        uploads.load();
      }
    });
    me.on('updatedGames', function() {
      games.load();
    });
    me.on('updatedUploads', function() {
      uploads.load();
    });
  }
});