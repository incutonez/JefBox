Ext.define('JefBox.view.main.MainView', {
  extend: 'Ext.Panel',
  alias: 'widget.mainView',
  requires: [
    'JefBox.view.main.MainViewModel',
    'JefBox.view.main.MainViewController',
    'JefBox.Sockets'
  ],

  controller: {
    type: 'mainView'
  },
  viewModel: {
    type: 'mainView'
  },

  fullscreen: true,
  layout: 'fit',
  title: 'Welcome ' + UserProfile.get('UserName'),
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
        text: 'Join Game',
        iconCls: Icons.CONNECT,
        handler: 'onClickJoinGame'
      }]
    }
  }]
});
