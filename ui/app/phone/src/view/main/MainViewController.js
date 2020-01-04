Ext.define('JefBox.view.main.MainViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.mainView',
  requires: [
    'JefBox.phone.view.teams.MainView',
    'JefBox.phone.view.games.JoinView'
  ],

  onClickChangeTeam: function() {
    Ext.create('JefBox.BaseDialog', {
      title: 'Change Team',
      layout: 'fit',
      height: '100%',
      width: '100%',
      items: [{
        xtype: 'phoneTeamsMainView'
      }]
    });
  },

  onClickJoinGame: function() {
    Ext.create('JefBox.phone.view.games.JoinView');
  },

  onClickSignOut: function() {
    UserProfile.signOut();
  }
});
