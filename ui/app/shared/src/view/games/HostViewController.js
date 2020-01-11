Ext.define('JefBox.view.games.HostViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.gamesHostView',

  toggleRoundItemAnswered: function(roundItemId, isComplete) {
    const gameRecord = this.getViewRecord();
    if (gameRecord) {
      gameRecord.toggleRoundItemComplete({
        roundItemId: roundItemId,
        isComplete: isComplete
      });
    }
  },

  onMarkRoundItemRow: function(grid, info) {
    this.toggleRoundItemAnswered(info.record.getId(), true);
  },

  onUnmarkRoundItemRow: function(grid, info) {
    this.toggleRoundItemAnswered(info.record.getId());
  },

  onClickNextQuestionBtn: function() {
    const currentQuestion = this.getCurrentQuestionRecord();
    this.toggleRoundItemAnswered(currentQuestion && currentQuestion.getId(), true);
  },

  onClickPreviousQuestionBtn: function() {
    const currentQuestion = this.getCurrentQuestionRecord();
    const previousQuestion = currentQuestion && currentQuestion.getPreviousQuestion();
    this.toggleRoundItemAnswered(previousQuestion && previousQuestion.getId());
  },

  onClickMarkAnswerCorrect: function(grid, info) {
    info.record.set('IsCorrect', true);
  },

  onClickMarkAnswerIncorrect: function(grid, info) {
    info.record.set('IsCorrect', false);
  },

  onClickSubmitAnswers: function() {
    const gameRecord = this.getViewRecord();
    if (gameRecord) {
      gameRecord.markAnswers(function(successful, response) {
        console.log(successful);
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