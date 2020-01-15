Ext.define('JefBox.view.main.MainView', {
  extend: 'Ext.Panel',
  alias: 'widget.mainView',
  requires: [
    'JefBox.view.main.MainViewModel',
    'JefBox.view.main.MainViewController',
    'JefBox.Sockets',
    'JefBox.EnumComboBox'
  ],

  controller: {
    type: 'mainView'
  },
  viewModel: {
    type: 'mainView'
  },

  bodyStyle: 'background-color: #222;',
  bodyPadding: 10,
  layout: {
    type: 'vbox',
    align: 'start'
  },
  bbar: {
    style: 'background-color: #cdcdcd;',
    items: [{
      xtype: 'button',
      tooltip: 'Areas',
      iconCls: Icons.START_MENU,
      arrow: false,
      menuAlign: 'b-tl',
      menu: {
        items: [{
          text: 'Log Out',
          iconCls: Icons.SIGN_OUT,
          handler: 'onClickSignOut'
        }]
      }
    }, {
      xtype: 'component',
      width: 1,
      margin: '0 10',
      height: '100%',
      style: 'background-color: rgb(34, 34, 34);'
    }]
  },
  items: [{
    xtype: 'button',
    text: 'Users',
    iconAlign: 'top',
    cls: Styles.BUTTON_LARGE,
    iconCls: Icons.USERS,
    style: 'border: 1px solid #cecece;',
    handler: 'onClickUsersView',
    margin: '0 0 10 0'
  }, {
    xtype: 'button',
    text: 'Teams',
    iconAlign: 'top',
    cls: Styles.BUTTON_LARGE,
    iconCls: Icons.TEAMS,
    style: 'border: 1px solid #cecece;',
    handler: 'onClickTeamsView',
    margin: '0 0 10 0'
  }, {
    xtype: 'button',
    text: 'Games',
    iconAlign: 'top',
    cls: Styles.BUTTON_LARGE,
    iconCls: Icons.GAMES,
    style: 'border: 1px solid #cecece;',
    handler: 'onClickGamesView',
    margin: '0 0 10 0'
  }, {
    xtype: 'button',
    text: 'Uploads',
    iconAlign: 'top',
    cls: Styles.BUTTON_LARGE,
    iconCls: Icons.UPLOAD,
    style: 'border: 1px solid #cecece;',
    handler: 'onClickUploadsView',
    margin: '0 0 10 0'
  }, {
    xtype: 'button',
    text: 'Painter',
    iconAlign: 'top',
    cls: Styles.BUTTON_LARGE,
    iconCls: Icons.PAINT,
    style: 'border: 1px solid #cecece;',
    handler: 'onClickPainterView',
    margin: '0 0 10 0'
  }]
});
