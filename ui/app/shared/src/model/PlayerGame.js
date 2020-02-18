Ext.define('JefBox.model.PlayerGame', {
  extend: 'JefBox.model.BaseGame',
  requires: [
    'JefBox.model.Team'
  ],

  hasOne: [{
    model: 'JefBox.model.Team',
    associationKey: 'Group',
    role: 'Group',
    getterName: 'getGroupRecord'
  }],

  proxy: {
    type: 'ajax',
    url: Schemas.Games.PLAYER_DETAILS
  },

  statics: {
    loadPlayerGame: function(gameId, cb) {
      this.load(null, {
        url: Routes.parseRoute(Schemas.Games.PLAYER_DETAILS, {
          id: gameId
        }),
        callback: function(record, operation, successful) {
          Ext.callback(cb, null, [record, successful]);
        }
      });
    }
  },

  getGroupId: function() {
    const groupRecord = this.getGroupRecord();
    return groupRecord && groupRecord.getId();
  },

  getUpdateGroupEvent: function() {
    return `${Schemas.Games.SOCKET_UPDATE_GROUP}${this.getId()}_${this.getGroupId()}`;
  }
});