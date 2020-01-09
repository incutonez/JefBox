Ext.define('JefBox.view.users.MainView', {
  extend: 'JefBox.view.BaseCrudView',
  alias: 'widget.usersMainView',
  requires: [
    'JefBox.view.users.MainViewController',
    'JefBox.store.Users'
  ],

  controller: {
    type: 'usersView'
  },
  viewModel: {
    data: {
      entityName: 'User'
    },
    stores: {
      mainStore: JefBox.store.Users
    }
  },

  NAME_DATAINDEX: 'UserName',

  getTitleBarConfig: function() {
    const config = this.callParent();
    if (!UserProfile.get('IsAdmin')) {
      Ext.Array.removeAt(config, 0);
    }
    return config;
  },

  getColumnsConfig: function() {
    const config = this.callParent();
    const columns = [{
      text: 'Active',
      dataIndex: 'onlineCls',
      align: 'center',
      width: 70,
      cell: {
        encodeHtml: false
      }
    }];
    if (UserProfile.get('IsAdmin')) {
      columns.push({
        text: 'Access Level',
        dataIndex: 'accessLevelDisplay',
        width: 110,
        editor: {
          xtype: 'enumComboBox',
          store: Enums.AccessLevels,
          bind: {
            value: '{record.AccessLevel}'
          }
        }
      });
    }
    Ext.Array.insert(config, 3, columns);
    return config;
  }
});