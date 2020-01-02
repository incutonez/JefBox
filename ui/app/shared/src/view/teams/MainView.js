Ext.define('JefBox.view.teams.MainView', {
  extend: 'JefBox.view.BaseCrudView',
  alias: 'widget.teamsMainView',
  requires: [
    'JefBox.store.Users',
    'JefBox.store.Teams',
    'JefBox.view.teams.MainViewController'
  ],

  itemConfig: {
    viewModel: {
      formulas: {
        usersDisplay: function(get) {
          return Ext.util.Format.storeToList({
            store: get('record.Users'),
            fields: 'UserName'
          });
        }
      }
    }
  },
  controller: {
    type: 'teamsMainView'
  },
  viewModel: {
    data: {
      entityName: 'Team'
    },
    stores: {
      mainStore: JefBox.store.Teams
    }
  },

  getColumnsConfig: function() {
    let config = this.callParent();
    Ext.Array.insert(config, 3, [{
      text: 'Users',
      dataIndex: 'Users',
      flex: 1,
      cell: {
        encodeHtml: false,
        bind: {
          value: '{usersDisplay}'
        }
      }
    }, {
      text: 'Owner',
      dataIndex: 'ownerDisplay'
    }]);
    return config;
  }
});