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
    const viewModel = this.getViewModel();
    const gameRecord = this.getViewRecord();
    const currentQuestion = viewModel && viewModel.get('currentQuestion');
    if (currentQuestion && gameRecord) {
      currentQuestion.set('AnswerDate', new Date());
      gameRecord.save();
    }
  },

  onClickMarkAnswerCorrect: function() {
    
  }
});