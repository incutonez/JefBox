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
    routes[Schemas.Games.CONNECT_PATH_UI] = {
      action: 'onRouteHostView',
      lazy: true
    };
    config.routes = routes;
    this.callParent(arguments);
  },

  onRouteHostView: function(params) {
    if (params.Id) {
      Ext.create('JefBox.view.games.HostView', {
        viewModel: {
          data: {
            viewRecordId: params.Id
          }
        }
      });
    }
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