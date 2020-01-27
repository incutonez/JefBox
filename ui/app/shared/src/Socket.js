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

  // TODO: Inspect socket sleeping and reconnecting
  // TODO: Add a time limit
  // TODO: Answers are submitting while being typed
  // TODO: Deal with long answers and how to display
  // TODO: Answers are erasing when typing in... but second time works
  setUpStoreListeners: function() {
    const me = this;
    me.on('connect', function() {
      me.emit('setUser', UserProfile.getData());
      // Unhook the previous events
      me.off('updatedUsers' + UserProfile.getId(), me.onUpdatedUser);
      me.off('updatedTeams', me.onUpdatedTeams);
      me.off('updatedUsers', me.onUpdatedUsers);
      me.off('userStatusChange', me.onUserStatusChanged);
      me.off('updatedGames', me.onUpdatedGames);
      me.off('updatedUploads', me.onUpdatedUploads);
      me.on('updatedUsers' + UserProfile.getId(), me.onUpdatedUser);
      me.on('updatedTeams', me.onUpdatedTeams);
      me.on('updatedUsers', me.onUpdatedUsers);
      me.on('userStatusChange', me.onUserStatusChanged);
      me.on('updatedGames', me.onUpdatedGames);
      me.on('updatedUploads', me.onUpdatedUploads);
    });
  },

  onUpdatedUploads: function() {
    JefBox.store.Uploads.load();
  },

  onUpdatedGames: function() {
    JefBox.store.Games.load();
  },

  // TODO: Probably remove this
  onUpdatedTeams: function() {
    JefBox.store.Teams.load();
    // JefBox.store.Users.load();
    // JefBox.store.Games.load();
  },

  onUpdatedUser: function() {
    UserProfile.load({
      callback: function() {
        // Need to set a global UserProfile VM property, so we can use in other views
        const appVM = Ext.getApplication().getMainView().getViewModel();
        appVM.set('userProfile', UserProfile);
      }
    });
  },

  // TODO: Optimize this
  onUpdatedUsers: function() {
    JefBox.store.Users.load();
    // JefBox.store.Teams.load();
  },

  onUserStatusChanged: function() {
    JefBox.store.Users.load();
    // JefBox.store.Games.load();
    if (!JefBox.store.Teams.isLoaded()) {
      JefBox.store.Teams.load();
    }
    if (!JefBox.store.Uploads.isLoaded()) {
      JefBox.store.Uploads.load();
    }
  }
});