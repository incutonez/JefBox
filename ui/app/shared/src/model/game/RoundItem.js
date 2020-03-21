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
    type: 'string',
    validators: [{
      type: 'presence'
    }]
  }, {
    name: 'RoundIndex',
    type: 'int',
    allowNull: true
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
    name: 'IsMultipleChoice',
    type: 'boolean'
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
    name: 'TimeLimit',
    type: 'int',
    defaultValue: 120,
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
    type: 'auto',
    depends: ['Url', 'Type'],
    convert: function(value, record) {
      const url = record.get('Url');
      const isYoutube = url.includes('youtube.com');
      if (isYoutube) {
        const matches = Ext.Object.fromQueryString(url.split('?')[1]);
        matches.videoId = matches.v;
        if (record.get('Type') !== Enums.RoundItemTypes.VIDEO) {
          if (!Ext.isEmpty(matches.start)) {
            matches.startSeconds = record.convertTimeOffset(matches.start);
            delete matches.start;
          }
          if (!Ext.isEmpty(matches.end)) {
            matches.endSeconds = record.convertTimeOffset(matches.end);
            delete matches.end;
          }
        }
        delete matches.v;
        return matches;
      }
      return value || '';
    }
  }],

  /**
   * Method for converting if the youtube time is specified in seconds only or minutes:seconds
   * @param {String} time
   * @return {Number} seconds
   */
  convertTimeOffset: function(time) {
    let seconds = time.split(':');
    if (!Ext.isEmpty(seconds)) {
      // Only dealing with seconds here, no need to make any changes
      if (seconds.length === 1) {
        seconds = parseInt(seconds, 10);
      }
      else if (seconds.length === 2) {
        seconds = parseInt(seconds[0], 10) * 60 + parseInt(seconds[1], 10);
      }
    }
    return seconds;
  },

  hasMany: [{
    model: 'JefBox.model.game.RoundItemChoice',
    associationKey: 'Choices',
    role: 'Choices',
    getterName: 'getChoicesStore',
    storeConfig: {
      remoteFilter: false,
      remoteSort: false,
      sorters: [{
        property: 'Order',
        direction: 'ASC'
      }]
    }
  }, {
    model: 'JefBox.model.game.RoundItemAnswer',
    associationKey: 'Answers',
    role: 'Answers',
    getterName: 'getAnswersStore'
  }],

  proxy: {
    type: 'ajax'
  },

  statics: {
    loadCurrentQuestion: function(config) {
      if (!config) {
        return;
      }
      this.load(null, {
        url: Routes.parseRoute(Schemas.Games.CURRENT_QUESTION, {
          id: config.gameId
        }),
        params: {
          groupId: config.groupId
        },
        callback: function(record, operation, successful) {
          Ext.callback(config.callback, null, [record, successful]);
        }
      });
    }
  },

  addAnswer: function(config) {
    config = config || {};
    Ext.Ajax.request({
      url: Routes.parseRoute(Schemas.Games.ADD_ANSWER_PATH_UI, {
        Id: this.get('GameId')
      }),
      method: 'POST',
      jsonData: {
        ChoiceId: config.choiceId,
        Answer: config.answer,
        UploadId: config.uploadId,
        RoundItemId: this.getId(),
        TeamId: config.groupId
      },
      callback: function(options, successful, response) {
        if (Ext.isFunction(config.callback)) {
          config.callback(successful, response);
        }
      }
    });
  },

  markAnswers: function(answersStore, cb) {
    if (!answersStore) {
      return;
    }
    const me = this;
    const teams = [];
    const users = [];
    const roundItemId = me.getId();
    const questionNumber = me.get('Order');
    answersStore.each(function(answer) {
      if (answer.get('IsCorrect')) {
        const teamId = answer.get('TeamId');
        if (!Ext.isEmpty(teamId)) {
          teams.push({
            Id: teamId,
            Points: answer.get('Points')
          });
        }
        users.push(answer.get('UserId'));
      }
    });
    Ext.Ajax.request({
      url: Routes.parseRoute(Schemas.Games.ADD_WINNER_PATH_UI, {
        Id: me.get('GameId')
      }),
      method: 'POST',
      jsonData: {
        RoundItemId: roundItemId,
        QuestionNumber: questionNumber,
        teams: teams,
        users: users
      },
      callback: function(operation, successful, response) {
        if (Ext.isFunction(cb)) {
          cb(successful, response);
        }
      }
    });
  }
});