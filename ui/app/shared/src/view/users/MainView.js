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
    var config = this.callParent();
    if (!UserProfile.get('IsAdmin')) {
      Ext.Array.removeAt(config, 0);
    }
    return config;
  },

  getColumnsConfig: function() {
    var config = this.callParent();
    var columns = [{
      text: 'Active',
      dataIndex: 'IsActive',
      align: 'center',
      width: 70,
      cell: {
        encodeHtml: false
      },
      renderer: function(value) {
        let colorCls = Styles.COLOR_FAILURE;
        let iconCls = Icons.CROSS;
        if (value) {
          iconCls = Icons.CHECKMARK;
          colorCls = Styles.COLOR_SUCCESS;
        }
        return Icons.getIconMarkup({
          iconCls: iconCls,
          colorCls: colorCls
        });
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