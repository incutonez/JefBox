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
  bind: {
    title: 'Welcome {userProfile.UserName}'
  },
  tools: [{
    // TODO: Can't turn this into a tool type because I can't use menu on it... would have to rework it
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
