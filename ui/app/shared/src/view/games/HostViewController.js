Ext.define('JefBox.view.games.HostViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.gamesHostView',

  onMarkQuestionAnsweredRow: function(grid, info) {
    const gameRecord = this.getViewRecord();
    const record = info.record;
    if (record && gameRecord) {
      record.set('AnswerDate', new Date());
      gameRecord.save();
    }
  },

  onMarkQuestionUnansweredRow: function(grid, info) {
    const gameRecord = this.getViewRecord();
    const record = info.record;
    if (record && gameRecord) {
      record.set('AnswerDate', null);
      gameRecord.save();
    }
  },

  onClickNextQuestionBtn: function() {
    const gameRecord = this.getViewRecord();
    const currentQuestion = this.getCurrentQuestionRecord();
    if (currentQuestion && gameRecord) {
      currentQuestion.set('AnswerDate', new Date());
      gameRecord.save();
    }
  },

  onClickMarkAnswerCorrect: function(grid, info) {
    info.record.set('IsCorrect', true);
  },

  onClickMarkAnswerIncorrect: function(grid, info) {
    info.record.set('IsCorrect', false);
  },

  onClickSubmitAnswers: function() {
    const winners = [];
    const gameRecord = this.getViewRecord();
    const currentQuestion = this.getCurrentQuestionRecord();
    const answersStore = currentQuestion && currentQuestion.getAnswersStore();
    if (answersStore) {
      answersStore.each(function(answerRecord) {
        if (answerRecord.get('IsCorrect')) {
          winners.push({
            RoundItemId: currentQuestion.getId(),
            QuestionNumber: currentQuestion.get('Order'),
            UniqueId: answerRecord.get('UniqueId')
          });
        }
      });
    }
    if (gameRecord) {
      gameRecord.addWinners({
        winners: winners,
        callback: function(successful, response) {
          console.log(successful);
        }
      });
    }
  },

  getCurrentQuestionRecord: function() {
    const viewModel = this.getViewModel();
    const currentQuestion = viewModel && viewModel.get('currentQuestion');
    if (!currentQuestion) {
      this.logError('currentQuestion is undefined');
    }
    return currentQuestion;
  }
});