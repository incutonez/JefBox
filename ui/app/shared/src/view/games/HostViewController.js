Ext.define('JefBox.view.games.HostViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.gamesHostView',
  requires: [
    'JefBox.view.uploads.MediaViewer',
    'JefBox.view.games.WinnerView',
    'JefBox.view.games.TieView'
  ],

  TIMER_TASK: Ext.create('Ext.util.TaskRunner'),

  // TODOJEF: Issue with this... it gets hit twice, but it doesn't get hit twice when loading the edit
  constructor: function(config) {
    const routes = config.routes = {};
    routes[Schemas.Games.CONNECT_PATH_UI] = {
      action: 'onRouteHostView',
      lazy: true
    };
    this.callParent(arguments);
  },

  destroy: function() {
    this.uninstallSockets();
    this.callParent();
  },

  onRouteHostView: function(params) {
    this.loadViewRecord(params.Id, true);
  },

  loadCurrentQuestion: function() {
    const me = this;
    const viewModel = me.getViewModel();
    const gameRecord = me.getViewRecord();
    if (gameRecord && viewModel) {
      me.setViewLoading(true);
      JefBox.model.game.RoundItem.loadCurrentQuestion({
        gameId: gameRecord.getId(),
        callback: function(questionRecord, successful) {
          if (successful) {
            viewModel.set({
              currentQuestion: questionRecord,
              timeRemaining: questionRecord.get('TimeLimit'),
              showAnswer: 0
            });
            viewModel.notify();
            if (questionRecord.get('IsMultipleChoice')) {
              const choicesGrid = me.lookup('choicesGrid');
              if (choicesGrid) {
                choicesGrid.forceRefresh();
              }
            }
          }
          me.setViewLoading(false);
        }
      });
    }
  },

  loadGameStandings: function() {
    const scoreStore = this.getScoreStore();
    if (scoreStore) {
      scoreStore.load();
    }
  },

  loadRoundAnswers: function() {
    const answersStore = this.getAnswersStore();
    const gameRecord = this.getViewRecord();
    if (answersStore && gameRecord) {
      answersStore.load({
        callback: function() {
          answersStore.processGroups(gameRecord.getTeamsStore());
        }
      });
    }
  },

  uninstallSockets: function() {
    const record = this.getViewRecord();
    if (record) {
      const gameUpdateEvent = record.getUpdateEvent();
      const gameUpdateRoundEvent = record.getUpdateRoundEvent();
      const gameUpdateRoundAnswersEvent = record.getUpdateRoundAnswersEvent();
      sockets.off(gameUpdateEvent);
      sockets.off(gameUpdateRoundEvent);
      sockets.off(gameUpdateRoundAnswersEvent);
    }
  },

  installSockets: function(uninstall) {
    const me = this;
    const record = me.getViewRecord();
    if (record) {
      const gameId = record.getId();
      const gameUpdateEvent = record.getUpdateEvent();
      const gameUpdateRoundEvent = record.getUpdateRoundEvent();
      const gameUpdateRoundAnswersEvent = record.getUpdateRoundAnswersEvent();
      if (uninstall) {
        me.uninstallSockets();
      }
      sockets.on(gameUpdateRoundEvent, function() {
        me.loadCurrentQuestion();
        me.loadGameStandings();
        me.loadRoundAnswers();
      });
      sockets.on(gameUpdateEvent, function() {
        me.loadViewRecord(gameId);
      });
      sockets.on(gameUpdateRoundAnswersEvent, function() {
        me.loadRoundAnswers();
      });
    }
  },

  loadViewRecord: function(gameId, initialLoad) {
    const me = this;
    const viewModel = me.getViewModel();
    if (viewModel) {
      me.setViewLoading(true);
      viewModel.set('viewRecord', null);
      viewModel.notify();
      JefBox.model.Game.load(gameId, {
        callback: function(record, operation, successful) {
          viewModel.set('viewRecord', record);
          viewModel.notify();
          me.installSockets(true);
          me.setViewLoading(false);
          if (initialLoad) {
            me.loadCurrentQuestion();
            me.loadRoundAnswers();
          }
        }
      });
    }
  },

  toggleRoundItemAnswered: function(roundItemId, revertPrevious) {
    const gameRecord = this.getViewRecord();
    if (gameRecord) {
      gameRecord.toggleRoundItemComplete({
        roundItemId: roundItemId,
        revertPrevious: revertPrevious
      });
    }
  },

  onRemoveTeamRow: function(grid, info) {
    const me = this;
    const gameRecord = me.getViewRecord();
    if (gameRecord) {
      me.setViewLoading(true);
      gameRecord.removeTeam(info.record.getId(), function(successful, response) {
        me.setViewLoading(false);
        me.loadViewRecord(gameRecord.getId());
      });
    }
  },

  onClickAnnounceWinner: function() {
    const me = this;
    const standingsStore = me.getScoreStore();
    const groups = standingsStore && standingsStore.getGroups();
    if (groups) {
      let tiedGroups = [];
      let highestGroup = {};
      groups.each(function(group) {
        const groupPoints = group.sum('Points');
        if (!highestGroup.points || highestGroup.points < groupPoints) {
          highestGroup = {
            points: groupPoints,
            group: group
          };
          tiedGroups = [group];
        }
        else if (highestGroup.points === groupPoints) {
          tiedGroups.push(group);
        }
      });
      if (tiedGroups.length > 1) {
        Ext.create('JefBox.view.games.TieView', {
          viewModel: {
            data: {
              winners: tiedGroups
            }
          },
          listeners: {
            selectedWinner: function(winner) {
              me.showWinnerView(winner);
            }
          }
        });
      }
      else {
        me.showWinnerView(highestGroup.group);
      }
    }
  },

  showWinnerView: function(winner) {
    const me = this;
    const gameRecord = me.getViewRecord();
    if (gameRecord) {
      me.setViewLoading(true);
      gameRecord.setWinner(winner.first().get('GroupId'), function(successful, response) {
        me.setViewLoading(false);
        Ext.create('JefBox.view.games.WinnerView', {
          viewModel: {
            data: {
              winnerName: winner.getGroupKey()
            }
          }
        });
      });
    }
  },

  onClickViewMediaButton: function() {
    const currentQuestion = this.getCurrentQuestionRecord();
    if (currentQuestion) {
      Ext.create('JefBox.view.uploads.MediaViewer', {
        maximized: true,
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
    this.toggleRoundItemAnswered(currentQuestion && currentQuestion.getId());
  },

  onClickPreviousQuestionBtn: function() {
    const currentQuestion = this.getCurrentQuestionRecord();
    this.toggleRoundItemAnswered(currentQuestion && currentQuestion.getId(), true);
  },

  onDeleteAnswerRow: function(grid, info) {
    const me = this;
    const gameRecord = me.getViewRecord();
    if (gameRecord) {
      gameRecord.deleteAnswer(info.record.getId());
    }
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
    const questionRecord = this.getCurrentQuestionRecord();
    if (questionRecord) {
      questionRecord.markAnswers(this.getAnswersStore());
    }
  },

  onClickStartTimer: function() {
    const viewModel = this.getViewModel();
    const timerOverAudio = this.lookup('timerOverAudio');
    if (viewModel) {
      let timeRemaining = viewModel.get('currentQuestion.TimeLimit');
      this.TIMER_TASK.start({
        run: function() {
          viewModel.set('timeRemaining', --timeRemaining);
          viewModel.notify();
          if (timeRemaining === 0 && timerOverAudio) {
            timerOverAudio.element.down('audio').dom.play();
          }
          return timeRemaining !== 0;
        },
        interval: 1000
      });
    }
  },

  onClickGoNuclear: function() {
    const gameRecord = this.getViewRecord();
    const currentQuestion = this.getCurrentQuestionRecord();
    if (gameRecord && currentQuestion) {
      gameRecord.submitEmptyRoundAnswers(currentQuestion.getId());
    }
  },

  getCurrentQuestionRecord: function() {
    const viewModel = this.getViewModel();
    const currentQuestion = viewModel && viewModel.get('currentQuestion');
    if (!currentQuestion) {
      this.logError('currentQuestion is undefined');
    }
    return currentQuestion;
  },

  getScoreStore: function() {
    return this.getStore('scoreStore');
  },

  getAnswersStore: function() {
    return this.getStore('answersStore');
  }
});