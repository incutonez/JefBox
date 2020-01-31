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
            teams.push({
              Id: teamId,
              Points: answer.get('Points')
            });
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