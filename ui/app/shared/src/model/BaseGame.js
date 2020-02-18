Ext.define('JefBox.model.BaseGame', {
  extend: 'JefBox.model.Crud',

  fields: [{
    name: 'Name',
    type: 'string',
    validators: [{
      type: 'presence'
    }]
  }, {
    name: 'Type',
    type: 'int',
    defaultValue: Enums.GameTypes.TRIVIA,
    validators: [{
      type: 'presence'
    }]
  }, {
    name: 'Status',
    type: 'int'
  }, {
    name: 'AllowTeams',
    type: 'boolean',
    defaultValue: true
  }, {
    name: 'FirstRoundItemId',
    type: 'int'
  }, {
    name: 'LastRoundItemId',
    type: 'int'
  }],

  proxy: {
    type: 'rest',
    url: Schemas.Games.BASE_PATH
  },

  setWinner: function(winnerId, cb) {
    this.set('WinnerId', winnerId);
    Ext.Ajax.request({
      url: Routes.parseRoute(Schemas.Games.ID_PATH_UI + '/winner/:{WinnerId:num}', this),
      method: 'PUT',
      callback: function(options, successful, response) {
        if (Ext.isFunction(cb)) {
          cb(successful, response);
        }
      }
    });
  },

  getCurrentQuestionRecord: function() {
    const roundItemsStore = this.getRoundItemsStore();
    if (roundItemsStore) {
      const questionIndex = roundItemsStore.findBy(function(r) {
        return Ext.isEmpty(r.get('AnswerDate'));
      });
      return roundItemsStore.getAt(questionIndex);
    }
  },

  toggleRoundItemComplete: function(config) {
    if (!config) {
      return;
    }
    Ext.Ajax.request({
      method: 'PUT',
      url: Routes.parseRoute(Schemas.Games.UPDATE_ROUND_ITEM_PATH_UI, {
        Id: this.getId(),
        RoundItemId: config.roundItemId
      }),
      jsonData: {
        revertPrevious: config.revertPrevious
      },
      callback: function(operation, successful, response) {
        if (Ext.isFunction(config.callback)) {
          config.callback(successful, response);
        }
      }
    });
  },

  getRoundItemById: function(id) {
    const roundItemsStore = this.getRoundItemsStore();
    return roundItemsStore && roundItemsStore.findRecord('Id', id, 0, false, true, true);
  },

  getUpdateEvent: function() {
    return `${Schemas.Games.SOCKET_UPDATE}${this.getId()}`;
  },

  getUpdateRoundEvent: function() {
    return `${Schemas.Games.SOCKET_UPDATE_ROUND}${this.getId()}`;
  },

  getUpdateRoundAnswersEvent: function() {
    return `${Schemas.Games.SOCKET_UPDATE_ROUND_ANSWERS}${this.getId()}`;
  }
});