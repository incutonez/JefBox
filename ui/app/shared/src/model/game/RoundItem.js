Ext.define('JefBox.model.game.RoundItem', {
  extend: 'Ext.data.Model',
  requires: [
    'JefBox.model.game.RoundItemChoice',
    'JefBox.model.game.RoundItemAnswer'
  ],

  idProperty: 'Id',
  identifier: 'negative',
  fields: [{
    name: 'Id',
    type: 'int'
  }, {
    name: 'Type',
    type: 'int',
    defaultValue: Enums.RoundItemTypes.TEXT,
    validators: [{
      type: 'presence'
    }]
  }, {
    name: 'Round',
    type: 'int',
    validators: [{
      type: 'presence'
    }]
  }, {
    name: 'RoundName',
    type: 'string'
  }, {
    name: 'Order',
    type: 'int',
    validators: [{
      type: 'presence'
    }]
  }, {
    name: 'Points',
    type: 'number',
    validators: [{
      type: 'presence'
    }]
  }, {
    name: 'Question',
    type: 'string',
    validators: [{
      type: 'presence'
    }]
  }, {
    name: 'Answer',
    type: 'string'
  }, {
    name: 'Url',
    type: 'string'
  }, {
    name: 'GameId',
    type: 'int',
    allowNull: true
  }, {
    name: 'UploadId',
    type: 'int',
    allowNull: true
  }, {
    name: 'AnswerDate',
    type: 'date',
    allowNull: true
  }, {
    name: 'TypeDisplay',
    type: 'string',
    depends: ['Type'],
    convert: function(value, record) {
      return Enums.RoundItemTypes.getDisplayValue(record.get('Type'));
    }
  }, {
    name: 'youtubeVideoId',
    type: 'string',
    depends: ['Url'],
    convert: function(value, record) {
      const url = record.get('Url');
      const isYoutube = url.includes('youtube.com');
      if (isYoutube) {
        const matches = url.match(/v=([^$]+)/);
        return matches && matches[1];
      }
      return value || '';
    }
  }],

  hasMany: [{
    model: 'JefBox.model.game.RoundItemChoice',
    associationKey: 'Choices',
    role: 'Choices',
    getterName: 'getChoicesStore'
  }, {
    model: 'JefBox.model.game.RoundItemAnswer',
    associationKey: 'Answers',
    role: 'Answers',
    getterName: 'getAnswersStore'
  }],

  proxy: {
    type: 'memory'
  },

  addAnswer: function(config) {
    config = config || {};
    const gameRecord = this.getGameRecord();
    if (gameRecord) {
      let teamId;
      const userId = UserProfile.getId();
      if (gameRecord.get('AllowTeams')) {
        const teamsStore = gameRecord.getTeamsStore();
        if (teamsStore) {
          teamsStore.each(function(teamRecord) {
            const usersStore = teamRecord.getUsersStore();
            const foundRecord = usersStore && usersStore.findRecord('Id', userId, 0, false, true, true);
            if (foundRecord) {
              teamId = teamRecord.getId();
              return false;
            }
          });
        }
      }
      Ext.Ajax.request({
        url: Routes.parseRoute(Schemas.Games.ADD_ANSWER_PATH_UI, gameRecord),
        method: 'POST',
        jsonData: {
          ChoiceId: config.choiceId,
          Answer: config.answer,
          UploadId: config.uploadId,
          RoundItemId: this.getId(),
          TeamId: teamId
        },
        callback: function(options, successful, response) {
          if (Ext.isFunction(config.callback)) {
            config.callback(successful, response);
          }
        }
      });
    }
  },

  getPreviousQuestion: function() {
    let previousRecord;
    const store = this.store;
    if (store) {
      previousRecord = store.getAt(store.indexOf(this) - 1);
    }
    return previousRecord;
  },

  getNextQuestion: function() {
    let previousRecord;
    const store = this.store;
    if (store) {
      previousRecord = store.getAt(store.indexOf(this) + 1);
    }
    return previousRecord;
  }
});