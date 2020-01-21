/**
 * When this gets required is key... it used be required in Application.js, but that caused issues with models and
 * stores loading before they should, and I couldn't use defaultValue in model definitions.  Now, this class is
 * required from the respective MainView, and when that happens, this requires the stores, which requires their models,
 * and allows for us to use Enums
 */
Ext.define('JefBox.Sockets', {
  singleton: true,
  alternateClassName: [
    'sockets'
  ],
  requires: [
    'JefBox.model.CurrentGame',
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
    }
  },

  on: function(event, handler, scope) {
    const connection = this.getConnection();
    if (connection) {
      connection.on(event, Ext.bind(handler, scope || this));
    }
  },

  off: function(event, handler) {
    const connection = this.getConnection();
    if (connection) {
      connection.off(event, handler);
    }
  },

  emit: function(id, message) {
    const connection = this.getConnection();
    if (connection) {
      connection.emit(id, message);
    }
  },

  setUpStoreListeners: function() {
    const me = this;
    const users = JefBox.store.Users;
    const teams = JefBox.store.Teams;
    const games = JefBox.store.Games;
    const uploads = JefBox.store.Uploads;
    me.off('userStatusChange');
    me.off('updatedTeams');
    me.off('updatedUsers');
    me.off('updatedGames');
    me.off('updatedUploads');
    me.on('connect', function() {
      me.emit('setUser', UserProfile.getData());
    });
    me.on('updatedUsers' + UserProfile.getId(), function() {
      UserProfile.load({
        callback: function() {
          // Need to set a global UserProfile VM property, so we can use in other views
          const appVM = Ext.getApplication().getMainView().getViewModel();
          appVM.set('userProfile', UserProfile);
        }
      });
    });
    me.on('updatedTeams', function() {
      teams.load();
      users.load();
      games.load();
    });
    me.on('updatedUsers', function() {
      users.load();
      teams.load();
    });
    me.on('userStatusChange', function() {
      users.load();
      games.load();
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