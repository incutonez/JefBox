Ext.define('JefBox.view.main.MainViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.mainView',
  requires: [
    'JefBox.view.teams.MainView',
    'JefBox.view.users.MainView',
    'JefBox.view.games.MainView',
    'JefBox.view.uploads.MainView',
    'JefBox.view.PainterView'
  ],

  constructor: function(config) {
    const routes = {};
    routes[Routes.HOME] = 'onRouteHome';
    routes[Routes.USERS] = 'onRouteUsers';
    routes[Routes.TEAMS] = 'onRouteTeams';
    routes[Schemas.Games.BASE_PATH_UI] = 'onRouteGames';
    routes[Routes.UPLOADS] = 'onRouteUploads';
    routes[Routes.PAINTER] = 'onRoutePainter';
    config.routes = routes;
    config.openWindows = {};
    this.callParent(arguments);
  },

  onRouteHome: function() {
    for (let key in this.openWindows) {
      const win = this.openWindows[key];
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

  onRoutePainter: function(params) {
    this.createTaskWindow('Painter', 'painterView', Icons.PAINT, Routes.PAINTER);
  },

  getTaskWindowByType: function(key) {
    return this.openWindows[key];
  },

  createTaskWindow: function(title, xtype, iconCls, key) {
    const openWindow = this.getTaskWindowByType(key);
    if (openWindow) {
      openWindow.show();
      openWindow.taskButton.setPressed(true);
      return;
    }
    const win = Ext.create('JefBox.BaseDialog', {
      modal: false,
      openWindowKey: key,
      bodyPadding: 0,
      items: [{
        xtype: xtype
      }],
      listeners: {
        scope: this,
        destroy: 'onDestroyTaskView',
        minimize: 'onMinimizeTaskWindow'
      }
    });
    const button = Ext.create('Ext.Button', {
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
    this.redirectTo(Routes.parseRoute(Schemas.Games.CONNECT_PATH_UI));
  },

  onClickUploadsView: function(button) {
    this.redirectTo(Routes.UPLOADS);
  },

  onClickPainterView: function(button) {
    this.redirectTo(Routes.PAINTER);
  },

  onClickSignOut: function() {
    UserProfile.signOut();
  }
});
