Ext.define('JefBox.view.main.MainViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.mainView',
  requires: [
    'JefBox.phone.view.teams.MainView',
    'JefBox.phone.view.games.JoinView',
    'JefBox.phone.view.games.RoundView'
  ],

  constructor: function(config) {
    const routes = config.routes = {};
    routes[Routes.HOME] = 'onRouteHome';
    routes[Schemas.Games.BASE_PATH_ID_UI] = {
      action: 'onRouteViewGame'
    };
    routes['games/join'] = {
      action: 'onRouteJoinGame'
    };
    this.callParent(arguments);
  },

  onRouteHome: function() {
    const gameView = this.gameView;
    const joinView = this.joinView;
    if (gameView) {
      gameView.close();
    }
    if (joinView) {
      joinView.close();
    }
    this.gameView = null;
    this.joinView = null;
  },

  onRouteViewGame: function() {
    const joinView = this.joinView;
    const gameView = this.gameView;
    if (gameView) {
      gameView.toFront();
    }
    else {
      this.gameView = Ext.create('JefBox.phone.view.games.RoundView', {
        viewModel: {
          data: {
            userProfile: UserProfile
          }
        },
        listeners: {
          scope: this,
          destroy: 'onDestroyRoundView'
        }
      });
    }
    if (joinView) {
      joinView.close();
    }
  },

  onRouteJoinGame: function() {
    const joinView = this.joinView;
    if (joinView) {
      joinView.toFront();
    }
    else {
      this.joinView = Ext.create('JefBox.phone.view.games.JoinView', {
        listeners: {
          scope: this,
          destroy: 'onDestroyJoinView'
        }
      });
    }
  },

  onDestroyJoinView: function() {
    if (!this.gameView) {
      this.redirectTo(Routes.HOME);
    }
  },

  onDestroyRoundView: function() {
    this.redirectTo(Routes.HOME);
  },

  onClickJoinGame: function() {
    this.redirectTo('games/join');
  },

  onClickSignOut: function() {
    UserProfile.signOut();
  }
});
