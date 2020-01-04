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

  itemConfig: {
    viewModel: {
      formulas: {
        gameStartTooltip: function(get) {
          return get('record.Status') === Enums.GameStatuses.RUNNING ? 'Pause Game' : 'Start Game';
        },
        hideConnectIcon: function(get) {
          return get('record.Status') !== Enums.GameStatuses.RUNNING;
        },
        hideStartIcon: function(get) {
          let statuses = Enums.GameStatuses;
          return !get('canEditRecord') || get('record.isDeleted') || !Ext.Array.contains([statuses.NEW, statuses.PAUSED], get('record.Status'));
        },
        hidePauseIcon: function(get) {
          return !get('canEditRecord') || get('record.isDeleted') || get('record.Status') !== Enums.GameStatuses.RUNNING;
        },
        hideDeleteIcon: function(get) {
          return get('record.isDeleted') || !get('canEditRecord') || get('record.Status') !== Enums.GameStatuses.NEW;
        }
      }
    }
  },

  getPluginsConfig: Ext.emptyFn,

  getColumnsConfig: function() {
    let config = this.callParent();
    Ext.Array.insert(config, 3, [{
      text: 'Status',
      dataIndex: 'Status',
      renderer: function(value) {
        return Enums.GameStatuses.getDisplayValue(value);
      }
    }, {
      text: 'Room',
      dataIndex: 'Room'
    }]);
    return config;
  },

  getActionsColumnItems: function() {
    let config = this.callParent();
    config.cell.tools.push({
      handler: 'onClickJoinGame',
      iconCls: Icons.CONNECT,
      tooltip: 'Join Game',
      bind: {
        hidden: '{hideConnectIcon}'
      }
    }, {
      handler: 'onClickStartGame',
      iconCls: Icons.START,
      bind: {
        tooltip: '{gameStartTooltip}',
        hidden: '{hideStartIcon}'
      }
    }, {
      handler: 'onClickPauseGame',
      tooltip: 'Pause Game',
      iconCls: Icons.PAUSE,
      bind: {
        hidden: '{hidePauseIcon}'
      }
    });
    return config;
  }
});