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
          console.log('changing');
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
      xtype: 'teamsMainView',
      bind: {
        store: '{viewRecord.Teams}'
      }
    }]
  }]
});