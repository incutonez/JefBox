Ext.define('JefBox.view.main.MainView', {
  extend: 'Ext.Panel',
  alias: 'widget.mainView',
  requires: [
    'JefBox.view.main.MainViewModel',
    'JefBox.view.main.MainViewController',
    'JefBox.Socket'
  ],

  controller: {
    type: 'mainView'
  },
  viewModel: {
    type: 'mainView'
  },

  title: 'Phone',
  layout: 'fit',
  tools: [{
    xtype: 'button',
    iconCls: Icons.MENU,
    arrow: false,
    menu: {
      items: [{
        text: 'Log Out',
        iconCls: Icons.SIGN_OUT,
        handler: 'onClickSignOut'
      }, {
        text: 'Change Team',
        iconCls: Icons.TEAMS,
        handler: 'onClickChangeTeam'
      }, {
        text: 'Join Game',
        iconCls: Icons.CONNECT,
        handler: 'onClickJoinGame'
      }]
    }
  }]
});
