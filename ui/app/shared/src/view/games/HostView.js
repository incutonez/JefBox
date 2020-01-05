Ext.define('JefBox.view.games.HostView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.gamesHostView',
  requires: [
    'JefBox.view.teams.MainView'
  ],

  viewModel: {
    data: {
      viewRecordId: null,
      store: null
    },
    formulas: {
      viewRecord: {
        bind: {
          bindTo: '{store}',
          deep: true
        },
        get: function(store) {
          return store && store.findRecord('Id', this.get('viewRecordId'), 0, false, true, true);
        }
      }
    }
  },

  layout: 'fit',
  bind: {
    title: 'Game: {viewRecord.Name}'
  },
  items: [{
    xtype: 'tabpanel',
    tabBar: {
      layout: {
        pack: 'start'
      }
    },
    items: [{
      title: 'Lobby',
      layout: {
        type: 'vbox'
      },
      items: [{
        xtype: 'grid',
        flex: 1,
        bind: {
          store: '{viewRecord.Teams}'
        },
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
        columns: [{
          text: 'Name',
          dataIndex: 'Name'
        }, {
          text: 'Users',
          dataIndex: 'Users',
          flex: 1,
          cell: {
            encodeHtml: false,
            bind: {
              value: '{usersDisplay}'
            }
          }
        }]
      }]
    }]
  }]
});