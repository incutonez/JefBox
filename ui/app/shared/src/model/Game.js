Ext.define('JefBox.model.Game', {
  extend: 'JefBox.model.BaseGame',
  requires: [
    'JefBox.model.Team',
    'JefBox.model.game.RoundItem',
    'JefBox.model.game.Score',
    'JefBox.model.CurrentGame'
  ],

  hasMany: [{
    model: 'JefBox.model.Team',
    associationKey: 'Teams',
    role: 'Teams',
    getterName: 'getTeamsStore'
  }, {
    model: 'JefBox.model.User',
    associationKey: 'Users',
    role: 'Users',
    getterName: 'getUsersStore'
  }, {
    model: 'JefBox.model.game.RoundItem',
    associationKey: 'RoundItems',
    role: 'RoundItems',
    getterName: 'getRoundItemsStore',
    transform: false,
    inverse: {
      getterName: 'getGameRecord'
    },
    storeConfig: {
      remoteSort: false,
      remoteFilter: false,
      groupField: 'Round',
      sorters: [{
        property: 'Order',
        direction: 'ASC'
      }]
    }
  }, {
    model: 'JefBox.model.game.Score',
    associationKey: 'Score',
    role: 'Score',
    getterName: 'getScoreStore',
    inverse: {
      getterName: 'getGameRecord'
    },
    storeConfig: {
      remoteSort: false,
      remoteFilter: false,
      groupField: 'GroupName'
    }
  }],

  connectSocket: function(cb) {
    const me = this;
    sockets.on('updatedGames' + me.getId(), function() {
      me.load({
        callback: function(record, options, successful) {
          if (Ext.isFunction(cb)) {
            cb(record, successful);
          }
        }
      });
    });
  }
});