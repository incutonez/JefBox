Ext.define('JefBox.view.games.HostViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.gamesHostView',
  requires: [
    'JefBox.view.uploads.MediaViewer'
  ],

  // TODOJEF: Issue with this... it gets hit twice, but it doesn't get hit twice when loading the edit
  constructor: function(config) {
    const routes = config.routes = {};
    routes[Schemas.Games.CONNECT_PATH_UI] = {
      action: 'onRouteHostView',
      lazy: true
    };
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
            scope: me,
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

  getRandomHex: function() {
    return '#' + (16777216 + Math.floor(Math.random() * 16777216)).toString(16).slice(-6);
  },


  // https://www.youtube.com/watch?v=1Bix44C1EzY
  generateConfetti: function(x, y) {
    const spread = 50;
    const zIndex = 999999;
    const particles = 20;
    const ticks = 300;
    const me = this;
    // launch a few confetti from the left edge
    confetti({
      particleCount: 50,
      angle: Math.floor(Math.random() * 120),
      spread: Math.random() * 100,
      zIndex: zIndex,
      ticks: ticks,
      colors: [me.getRandomHex(), me.getRandomHex(), me.getRandomHex()],
      origin: {
        x: x,
        y: y
      }
    });
  },

  // TODO: https://www.npmjs.com/package/canvas-confetti
  onClickAnnounceWinner: function() {
    const taskRunner = Ext.create('Ext.util.TaskRunner');
    const me = this;
    taskRunner.start({
      interval: 100,
      run: function() {
        me.generateConfetti(Math.random(), Math.random());
      }
    });
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

  onClickViewImage: function(grid, info) {
    Ext.create('JefBox.view.uploads.MediaViewer', {
      viewModel: {
        data: {
          uploadId: info.record.get('UploadId')
        }
      }
    });
  },

  onClickSubmitAnswers: function() {
    const gameRecord = this.getViewRecord();
    if (gameRecord) {
      gameRecord.markAnswers();
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