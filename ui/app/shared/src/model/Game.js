Ext.define('JefBox.model.Game', {
  extend: 'JefBox.model.Crud',
  requires: [
    'JefBox.AssociationWriter',
    'JefBox.model.Team',
    'JefBox.model.game.RoundItem',
    'JefBox.model.game.Score'
  ],

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
    name: 'Room',
    type: 'string'
  }, {
    name: 'Status',
    type: 'int'
  }, {
    name: 'AllowTeams',
    type: 'boolean',
    defaultValue: true
  }],

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
      grouper: {
        groupFn: function(item) {
          return Ext.isEmpty(item.get('TeamId')) ? 'User ' + item.get('UserId') : 'Team ' + item.get('TeamId');
        }
      }
    }
  }],

  proxy: {
    type: 'rest',
    url: Schemas.Games.BASE_PATH,
    writer: {
      type: 'associationWriter',
      writeAllFields: true,
      allDataOptions: {
        associated: {
          RoundItems: {
            Choices: true
          }
        },
        critical: true
      },
      partialDataOptions: {
        associated: true,
        critical: true
      }
    }
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

  markAnswers: function(cb) {
    const currentQuestion = this.getCurrentQuestionRecord();
    if (!currentQuestion) {
      return;
    }
    const teams = [];
    const users = [];
    const answersStore = currentQuestion.getAnswersStore();
    const roundItemId = currentQuestion.getId();
    const questionNumber = currentQuestion.get('Order');
    if (answersStore) {
      answersStore.each(function(answer) {
        if (answer.get('IsCorrect')) {
          const teamId = answer.get('TeamId');
          if (!Ext.isEmpty(teamId)) {
            teams.push(teamId);
          }
          users.push(answer.get('UserId'));
        }
      });
    }
    Ext.Ajax.request({
      url: Routes.parseRoute(Schemas.Games.ADD_WINNER_PATH_UI, this),
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
        isComplete: config.isComplete
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
  }
});