Ext.define('JefBox.view.games.MainViewController', {
  extend: 'JefBox.view.BaseCrudViewController',
  alias: 'controller.gamesMainView',
  requires: [
    'JefBox.view.games.EditView'
  ],

  BASE_ROUTE: Routes.GAMES,
  EDIT_VIEW: 'JefBox.view.games.EditView',

  constructor: function(config) {
    const routes = {};
    routes.games = {
      action: 'onRouteMainView',
      lazy: true
    };
    routes[Schemas.Games.CONNECT_PATH_UI] = {
      action: 'onRouteHostView',
      lazy: true
    };
    routes[Schemas.Games.BASE_PATH_ID_UI] = {
      action: 'onRouteGameView',
      lazy: true
    };
    config.routes = routes;
    this.callParent(arguments);
  },

  showEditDialog: function(record) {
    Routes.redirectTo(Routes.parseRoute(Schemas.Games.BASE_PATH_ID_UI, record));
  },

  onRouteMainView: function() {
    const me = this;
    if (me.editView) {
      me.editView.close();
    }
    if (me.hostView) {
      me.hostView.close();
    }
    me.editView = null;
    me.hostView = null;
  },

  onRouteGameView: function(params) {
    if (!this.editView) {
      this.editView = Ext.create(this.EDIT_VIEW, {
        listeners: {
          scope: this,
          destroy: 'onDestroyGameView'
        }
      });
    }
  },

  onRouteHostView: function(params) {
    if (!this.hostView) {
      this.hostView = Ext.create('JefBox.view.games.HostView', {
        listeners: {
          scope: this,
          destroy: 'onDestroyHostView'
        }
      });
    }
  },

  onDestroyGameView: function() {
    this.redirectTo(Routes.parseRoute(Schemas.Games.BASE_PATH_UI));
  },

  onDestroyHostView: function() {
    this.redirectTo(Routes.parseRoute(Schemas.Games.BASE_PATH_UI));
  },

  onClickStartGame: function(grid, info) {
    const record = info.record;
    if (record) {
      record.set('Status', Enums.GameStatuses.RUNNING);
      record.save();
    }
  },

  onClickPauseGame: function(grid, info) {
    const record = info.record;
    if (record) {
      record.set('Status', Enums.GameStatuses.PAUSED);
      record.save();
    }
  },

  onClickJoinGame: function(grid, info) {
    this.redirectTo(Routes.parseRoute(Schemas.Games.CONNECT_PATH_UI, info.record));
  }
});