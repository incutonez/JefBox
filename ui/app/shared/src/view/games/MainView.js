Ext.define('JefBox.view.games.MainView', {
  extend: 'JefBox.view.BaseCrudView',
  alias: 'widget.gamesMainView',
  requires: [
    'JefBox.view.games.MainViewController'
  ],

  controller: {
    type: 'gamesMainView'
  },
  viewModel: {
    data: {
      entityName: 'Game'
    },
    stores: {
      mainStore: JefBox.store.Games
    }
  },

  getPluginsConfig: Ext.emptyFn,

  getColumnsConfig: function() {
    let config = this.callParent();
    Ext.Array.insert(config, 3, [{
      text: 'Room',
      dataIndex: 'Room'
    }]);
    return config;
  }
});