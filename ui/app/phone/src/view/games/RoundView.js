Ext.define('JefBox.phone.view.games.RoundView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.phoneGamesRoundView',
  requires: [
    'JefBox.model.PlayerGame',
    'JefBox.model.game.RoundItem',
    'JefBox.view.PainterView'
  ],
  mixins: [
    'Ext.route.Mixin'
  ],

  viewModel: {
    data: {
      saveBtnText: 'Submit',
      userAnswer: null,
      gameId: null,
      waitingNextQuestion: false,
      selectedChoice: null,
      uploadId: null,
      viewRecord: null,
      currentQuestion: null
    },
    formulas: {
      hideAnswerField: function(get) {
        return get('isDrawing') || get('currentQuestion.IsMultipleChoice');
      },
      isDrawing: function(get) {
        return get('currentQuestion.Type') === Enums.RoundItemTypes.DRAWING;
      },
      loadingMask: function(get) {
        const answers = get('currentQuestion.Answers');
        const found = answers && answers.findRecord('GroupId', get('viewRecord.Group.Id'), 0, false, true, true);
        if (found) {
          this.set({
            userAnswer: found.get('Answer'),
            uploadId: found.get('UploadId')
          });
          return 'Answer submitted...\nAwaiting next round.';
        }
        this.set({
          userAnswer: null,
          uploadId: null
        });
        return false;
      },
      mediaMarkup: function(get) {
        const uploadId = get('uploadId');
        if (uploadId) {
          return `<img style="max-height: 100%; max-width: 100%;" src="api/uploads/${uploadId}" />`;
        }
      }
    }
  },

  defaultListenerScope: true,
  isCrudDialog: true,
  minimizable: false,
  maximizable: false,
  maximized: true,
  layout: {
    type: 'vbox'
  },
  bind: {
    title: 'Round: {currentQuestion.Round}, Question: {currentQuestion.Order}',
    loading: '{loadingMask}'
  },
  items: [{
    xtype: 'textfield',
    label: 'Your Answer',
    maxWidth: 300,
    reference: 'answerField',
    bind: {
      value: '{userAnswer}',
      hidden: '{hideAnswerField}'
    },
    listeners: {
      keydown: 'onKeyDownAnswerField'
    }
  }, {
    xtype: 'grid',
    flex: 1,
    maxWidth: 400,
    reference: 'choicesGrid',
    bind: {
      store: '{currentQuestion.Choices}',
      hidden: '{!currentQuestion.IsMultipleChoice}',
      selection: '{selectedChoice}'
    },
    columns: [{
      text: 'Number',
      dataIndex: 'Order'
    }, {
      text: 'Answer',
      flex: 1,
      dataIndex: 'Value'
    }]
  }, {
    xtype: 'painterView',
    flex: 1,
    reference: 'painterView',
    bind: {
      hidden: '{!isDrawing || uploadId}'
    },
    viewModel: {
      data: {
        hideSaveBtn: true
      }
    }
  }, {
    xtype: 'component',
    bind: {
      html: '{mediaMarkup}'
    }
  }],

  constructor: function(config) {
    const routes = config.routes = {};
    routes[Schemas.Games.BASE_PATH_ID_UI] = {
      action: 'onRouteViewGame',
      lazy: true
    };
    this.callParent(arguments);
  },

  loadCurrentQuestion: function() {
    const me = this;
    const gameRecord = me.getViewRecord();
    if (gameRecord) {
      JefBox.model.game.RoundItem.loadCurrentQuestion({
        groupId: gameRecord.getGroupId(),
        gameId: gameRecord.getId(),
        callback: function(questionRecord, successful) {
          if (successful) {
            const viewModel = me.getViewModel();
            const choicesGrid = me.lookup('choicesGrid');
            if (viewModel) {
              viewModel.set('currentQuestion', questionRecord);
            }
            if (choicesGrid) {
              choicesGrid.forceRefresh();
            }
          }
        }
      });
    }
  },

  loadViewRecord: function(gameId) {
    const me = this;
    const viewModel = me.getViewModel();
    if (viewModel && gameId) {
      me.setLoading(true);
      JefBox.model.PlayerGame.loadPlayerGame(gameId, function(record, successful) {
        me.setLoading(false);
        if (successful) {
          viewModel.set('viewRecord', record);
          sockets.on(Schemas.Games.SOCKET_UPDATE_GROUP + record.getId() + record.getGroupId(), function() {
            me.loadCurrentQuestion();
          });
          sockets.on(Schemas.Games.SOCKET_UPDATE + record.getId(), function() {
            me.loadCurrentQuestion();
          });
          me.loadCurrentQuestion();
        }
        else {
          me.logError(`Could not load game ${gameId}.`, true);
          me.close();
        }
      });
    }
  },

  onRouteViewGame: function(params) {
    this.loadViewRecord(params.Id);
  },

  submitAnswer: function() {
    const me = this;
    const viewModel = me.getViewModel();
    const gameRecord = me.getViewRecord();
    const questionRecord = viewModel && viewModel.get('currentQuestion');
    if (questionRecord && gameRecord) {
      const config = {
        Id: gameRecord.getId(),
        groupId: gameRecord.get('AllowTeams') ? gameRecord.getGroupId() : null
      };
      me.setLoading(true);
      if (viewModel.get('isDrawing')) {
        const painterView = me.lookup('painterView');
        if (painterView) {
          painterView.uploadImage({
            callback: function(response, successful) {
              const data = response.getResponseData();
              if (successful && data) {
                config.uploadId = data.UploadId;
                questionRecord.addAnswer(config);
              }
            }
          });
        }
      }
      else {
        let answer = viewModel.get('userAnswer');
        if (questionRecord.get('IsMultipleChoice')) {
          const selectedChoice = viewModel.get('selectedChoice');
          config.choiceId = selectedChoice && selectedChoice.getId();
        }
        if (answer) {
          config.answer = answer.replace(/\s*$/, '');
        }
        questionRecord.addAnswer(config);
      }
    }
  },

  onKeyDownAnswerField: function(field, event) {
    if (event.isEnterKey()) {
      this.submitAnswer();
    }
  },

  onClickSaveBtn: function() {
    this.submitAnswer();
  }
});