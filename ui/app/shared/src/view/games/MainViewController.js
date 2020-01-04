Ext.define('JefBox.view.games.MainViewController', {
  extend: 'JefBox.view.BaseCrudViewController',
  alias: 'controller.gamesMainView',
  requires: [
    'JefBox.view.games.EditView'
  ],

  BASE_ROUTE: Routes.GAMES,
  EDIT_VIEW: 'JefBox.view.games.EditView',

  onClickStartGame: function(grid, info) {
    let record = info.record;
    if (record) {
      record.set('Status', Enums.GameStatuses.RUNNING);
      record.save();
    }
  },

  onClickPauseGame: function(grid, info) {
    let record = info.record;
    if (record) {
      record.set('Status', Enums.GameStatuses.PAUSED);
      record.save();
    }
  },

  onClickJoinGame: function(grid, info) {
    Ext.create('JefBox.view.games.HostView', {
      viewModel: {
        data: {
          store: JefBox.store.Games,
          viewRecordId: info.record.getId()
        }
      }
    });
  }
});