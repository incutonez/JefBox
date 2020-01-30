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
      this.setConnection(io({
        forceNew: true
      }));
      this.setUpStoreListeners();
    }
  },

  on: function(event, handler, scope) {
    const connection = this.getConnection();
    if (connection) {
      connection.on(event, Ext.bind(handler, scope || this));
    }
  },

  off: function(event, handler, scope) {
    const connection = this.getConnection();
    if (connection) {
      connection.off(event, Ext.bind(handler, scope || this));
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
    let connected = false;
    me.on('connect', function() {
      me.emit('setUser', UserProfile.getData());
      if (!JefBox.store.Games.isLoaded()) {
        JefBox.store.Games.load();
      }
      if (!JefBox.store.Teams.isLoaded()) {
        JefBox.store.Teams.load();
      }
      if (!connected) {
        me.on('updatedUsers' + UserProfile.getId(), me.onUpdatedUser);
        me.on('updatedTeams', me.onUpdatedTeams);
        me.on('updatedUsers', me.onUpdatedUsers);
        me.on('userStatusChange', me.onUserStatusChanged);
        me.on('updatedGames', me.onUpdatedGames);
        me.on('updatedUploads', me.onUpdatedUploads);
        connected = true;
      }
    });
  },

  onUpdatedUploads: function() {
    JefBox.store.Uploads.load();
  },

  onUpdatedGames: function() {
    JefBox.store.Games.load();
  },

  onUpdatedTeams: function() {
    JefBox.store.Teams.load();
  },

  onUpdatedUser: function() {
    // Need to set a global UserProfile VM property, so we can use in other views
    const appVM = Ext.getApplication().getMainView().getViewModel();
    UserProfile.load({
      callback: function() {
        if (appVM) {
          appVM.set('userProfile', UserProfile);
        }
      }
    });
  },

  onUpdatedUsers: function() {
    JefBox.store.Users.load();
  },

  onUserStatusChanged: function() {
    JefBox.store.Users.load();
  }
});