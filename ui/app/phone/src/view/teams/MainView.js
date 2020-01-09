Ext.define('JefBox.phone.view.teams.MainView', {
  extend: 'Ext.grid.Grid',
  alias: 'widget.phoneTeamsMainView',
  requires: [
    'JefBox.phone.view.teams.EditView'
  ],

  store: JefBox.store.Teams,
  defaultListenerScope: true,
  title: 'Teams',
  titleBar: {
    items: [{
      xtype: 'button',
      align: 'right',
      iconCls: Icons.NEW,
      text: 'Team',
      handler: 'onClickAddTeam'
    }]
  },
  itemConfig: {
    viewModel: {
      formulas: {
        userInTeam: {
          bind: {
            bindTo: '{record.Users.count}'
          },
          get: function() {
            const usersStore = this.get('record.Users');
            return !usersStore || usersStore.findRecord('Id', UserProfile.getId(), 0, false, true, true);
          }
        }
      }
    }
  },
  columns: [{
    align: 'center',
    width: 40,
    menu: null,
    text: Icons.getIconMarkup({
      iconCls: Icons.ACTIONS,
      colorCls: Styles.BASE_COLOR,
      tooltip: 'Actions'
    }),
    cell: {
      tools: [{
        iconCls: Icons.SIGN_IN,
        handler: 'onClickJoinTeam',
        tooltip: 'Join Team',
        bind: {
          hidden: '{userInTeam}'
        }
      }, {
        iconCls: Icons.SIGN_OUT,
        handler: 'onClickLeaveTeam',
        tooltip: 'Leave Team',
        bind: {
          hidden: '{!userInTeam}'
        }
      }]
    }
  }, {
    text: 'Name',
    dataIndex: 'Name',
    flex: 1
  }],

  onClickAddTeam: function() {
    Ext.create('JefBox.phone.view.teams.EditView', {
      viewModel: {
        data: {
          viewRecord: JefBox.model.Team.loadData()
        }
      }
    });
  },

  onClickJoinTeam: function(grid, info) {
    const record = info.record;
    const usersStore = record && record.getUsersStore();
    if (usersStore) {
      usersStore.add(UserProfile);
      record.save();
    }
  },

  onClickLeaveTeam: function(grid, info) {
    const record = info.record;
    const usersStore = record && record.getUsersStore();
    if (usersStore) {
      const found = usersStore.findRecord('Id', UserProfile.getId(), 0, false, true, true);
      usersStore.remove(found);
      record.save();
    }
  }
});