Ext.define('JefBox.view.games.HostViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.gamesHostView',
  requires: [
    'JefBox.view.uploads.MediaViewer'
  ],

// TODOJEF: There's an issue here with the host view being behind the main grid view when the page reloads
  constructor: function(config) {
    const routes = {};
    routes[Schemas.Games.CONNECT_PATH_UI] = {
      action: 'onRouteHostView',
      lazy: true
    };
    config.routes = routes;
    this.callParent(arguments);
  },

  onRouteHostView: function(params) {
    this.loadViewRecord(params.Id);
  },

  loadViewRecord: function(gameId) {
    const me = this;
    const viewModel = me.getViewModel();
    if (viewModel) {
      me.setViewLoading(true);
      viewModel.set('viewRecord', null);
      viewModel.notify();
      JefBox.model.Game.load(gameId, {
        callback: function(record, operation, successful) {
          viewModel.set('viewRecord', record);
          record.connectSocket({
            before: function() {
              me.setViewLoading(true);
            },
            after: function() {
              me.setViewLoading(false);
            }
          });
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

  onMarkRoundItemRow: function(grid, info) {
    this.toggleRoundItemAnswered(info.record.getId(), true);
  },

  onUnmarkRoundItemRow: function(grid, info) {
    this.toggleRoundItemAnswered(info.record.getId());
  },

  onClickViewMediaButton: function() {
    const currentQuestion = this.getCurrentQuestionRecord();
    if (currentQuestion) {
      Ext.create('JefBox.view.uploads.MediaViewer', {
        viewModel: {
          data: {
            uploadId: currentQuestion.get('UploadId'),
            imageUrl: currentQuestion.get('Url'),
            videoId: currentQuestion.get('youtubeVideoId')
          }
        }
      });
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