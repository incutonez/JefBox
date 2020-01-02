Ext.define('JefBox.view.teams.SelectView', {
  extend: 'Ext.Container',
  alias: 'widget.teamsSelectView',
  requires: [
    'JefBox.view.teams.EditView'
  ],

  viewModel: {
    formulas: {
      availableTeamsFilter: {
        bind: {
          bindTo: '{viewRecord.Teams.count}'
        },
        get: function(count) {
          let selectedTeams = this.get('viewRecord.Teams');
          return [{
            property: 'Id',
            value: selectedTeams && selectedTeams.collect('Id') || [],
            operator: 'notin'
          }];
        }
      }
    },
    stores: {
      availableTeamsStore: {
        type: 'chained',
        source: JefBox.store.Teams,
        filters: '{availableTeamsFilter}'
      }
    }
  },
  defaultListenerScope: true,
  layout: {
    type: 'hbox'
  },
  items: [{
    xtype: 'grid',
    title: 'Teams',
    reference: 'teamsView',
    flex: 1,
    bind: {
      store: '{viewRecord.Teams}'
    },
    // Absolutely required in order to get the record binding
    itemConfig: {
      viewModel: {
        formulas: {
          usersMarkup: function(get) {
            return Ext.util.Format.storeToList({
              store: get('record.Users'),
              fields: 'UserName'
            });
          }
        }
      }
    },
    listeners: {
      edit: 'onEditTeam',
      canceledit: 'onCancelEditTeam'
    },
    plugins: [{
      type: 'gridrowdragdrop'
    }],
    columns: [{
      text: 'Actions',
      cell: {
        tools: [{
          iconCls: Icons.DELETE,
          tooltip: 'Delete Team',
          handler: 'onClickDeleteTeam'
        }]
      }
    }, {
      text: 'Name',
      dataIndex: 'Name'
    }, {
      text: 'Color',
      dataIndex: 'Color'
    }, {
      text: 'Users',
      flex: 1,
      cell: {
        encodeHtml: false,
        bind: '{usersMarkup}'
      }
    }]
  }, {
    xtype: 'grid',
    title: 'Available',
    margin: '0 0 0 10',
    titleBar: {
      items: [{
        xtype: 'button',
        align: 'right',
        tooltip: 'Create Team',
        iconCls: Icons.NEW,
        handler: 'onClickCreateTeam'
      }]
    },
    plugins: [{
      type: 'gridrowdragdrop'
    }],
    bind: {
      store: '{availableTeamsStore}'
    },
    columns: [{
      text: 'Name',
      dataIndex: 'Name',
      flex: 1
    }]
  }],

  onClickDeleteTeam: function(grid, info) {
    info.record.store.remove(info.record);
  },

  onEditTeam: function(sender, location) {
    this.savingRecord = true;
  },

  onCancelEditTeam: function(sender, location) {
    let record = location.record;
    if (!this.savingRecord && record.phantom) {
      record.store.remove(record);
    }
    this.savingRecord = false;
  },

  showEditDialog: function(record) {
    Ext.create('JefBox.view.teams.EditView', {
      viewModel: {
        data: {
          viewRecord: record || JefBox.model.Team.loadData()
        }
      }
    });
  },

  onClickCreateTeam: function() {
    this.showEditDialog();
  }
});