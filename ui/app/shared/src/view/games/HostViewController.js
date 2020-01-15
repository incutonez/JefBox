Ext.define('JefBox.view.games.HostViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.gamesHostView',

  init: function() {
    const viewModel = this.getViewModel();
    const gameId = viewModel && viewModel.get('viewRecordId');
    sockets.on('updatedGames' + gameId, this.onUpdatedGame, this);
    this.loadViewRecord();
  },

  loadViewRecord: function() {
    const me = this;
    const viewModel = me.getViewModel();
    if (viewModel) {
      me.setViewLoading(true);
      viewModel.set('viewRecord', null);
      viewModel.notify();
      JefBox.model.Game.load(viewModel.get('viewRecordId'), {
        callback: function(record, operation, successful) {
          viewModel.set('viewRecord', record);
          viewModel.notify();
          me.setViewLoading(false);
        }
      });
    }
  },

  toggleRoundItemAnswered: function(roundItemId, isComplete) {
    const viewModel = this.getViewModel();
    const gameRecord = this.getViewRecord();
    if (gameRecord) {
      gameRecord.toggleRoundItemComplete({
        roundItemId: roundItemId,
        isComplete: isComplete,
        callback: function(successful, response) {
          if (successful) {
            // Reset if the answer is showing
            viewModel.set('showAnswer', 0);
          }
        }
      });
    }
  },

  onUpdatedGame: function() {
    this.loadViewRecord();
  },

  onMarkRoundItemRow: function(grid, info) {
    this.toggleRoundItemAnswered(info.record.getId(), true);
  },

  onUnmarkRoundItemRow: function(grid, info) {
    this.toggleRoundItemAnswered(info.record.getId());
  },

  onClickViewMediaButton: function() {
    const currentQuestion = this.getCurrentQuestionRecord();
    if (currentQuestion) {
      let markup;
      const uploadId = currentQuestion.get('UploadId');
      let url = uploadId ? `api/uploads/${uploadId}` : currentQuestion.get('Url');
      if (currentQuestion.get('Type') === Enums.RoundItemTypes.IMAGE) {
        markup = `<img width="100%" src="${url}" />`;
      }
      if (url) {
        Ext.create('JefBox.BaseDialog', {
          width: null,
          height: 500,
          bodyPadding: 0,
          items: [{
            xtype: 'component',
            html: markup
          }]
        });
      }
    }
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