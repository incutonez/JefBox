Ext.define('JefBox.view.main.MainViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.mainView',
  requires: [
    'JefBox.view.teams.MainView',
    'JefBox.view.users.MainView',
    'JefBox.view.games.MainView',
    'JefBox.view.uploads.MainView'
  ],

  constructor: function(config) {
    let routes = {};
    routes[Routes.HOME] = 'onRouteHome';
    routes[Routes.USERS] = 'onRouteUsers';
    routes[Routes.TEAMS] = 'onRouteTeams';
    routes[Routes.GAMES] = 'onRouteGames';
    routes[Routes.UPLOADS] = 'onRouteUploads';
    config.routes = routes;
    config.openWindows = {};
    this.callParent(arguments);
  },

  onRouteHome: function() {
    for (let key in this.openWindows) {
      let win = this.openWindows[key];
      win.hide();
      win.taskButton.setPressed(false);
    }
  },

  onRouteUsers: function(params) {
    this.createTaskWindow('Users', 'usersMainView', Icons.USERS, Routes.USERS);
  },

  onRouteTeams: function(params) {
    this.createTaskWindow('Teams', 'teamsMainView', Icons.TEAMS, Routes.TEAMS);
  },

  onRouteGames: function(params) {
    this.createTaskWindow('Games', 'gamesMainView', Icons.GAMES, Routes.GAMES);
  },

  onRouteUploads: function(params) {
    this.createTaskWindow('Uploads', 'uploadsMainView', Icons.UPLOAD, Routes.UPLOADS);
  },

  getTaskWindowByType: function(key) {
    return this.openWindows[key];
  },

  createTaskWindow: function(title, xtype, iconCls, key) {
    var openWindow = this.getTaskWindowByType(key);
    if (openWindow) {
      openWindow.show();
      openWindow.taskButton.setPressed(true);
      return;
    }
    var win = Ext.create('JefBox.BaseDialog', {
      modal: false,
      openWindowKey: key,
      items: [{
        xtype: xtype
      }],
      listeners: {
        scope: this,
        destroy: 'onDestroyTaskView',
        minimize: 'onMinimizeTaskWindow'
      }
    });
    var button = Ext.create('Ext.Button', {
      iconCls: iconCls,
      text: title,
      enableToggle: true,
      pressed: true,
      handler: 'onClickTaskButton',
      taskWindow: win,
      margin: '0 10 0 0'
    });
    win.taskButton = button;
    this.getView().getBbar().add(button);
    this.openWindows[key] = win;
  },

  onMinimizeTaskWindow: function(win) {
    this.redirectTo(Routes.HOME);
  },

  onClickTaskButton: function(button) {
    if (button.isPressed()) {
      button.taskWindow.show();
    }
    else {
      button.taskWindow.hide();
    }
  },

  onDestroyTaskView: function(win) {
    if (win.taskButton) {
      win.taskButton.destroy();
      delete this.openWindows[win.openWindowKey];
    }
    this.redirectTo(Routes.HOME);
  },

  onClickUsersView: function(button) {
    this.redirectTo(Routes.USERS);
  },

  onClickTeamsView: function(button) {
    this.redirectTo(Routes.TEAMS);
  },

  onClickGamesView: function(button) {
    this.redirectTo(Routes.GAMES);
  },

  onClickUploadsView: function(button) {
    this.redirectTo(Routes.UPLOADS);
  }
});
