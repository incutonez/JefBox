Ext.define('JefBox.phone.view.games.RoundView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.phoneGamesRoundView',
  requires: [
    'JefBox.model.Game'
  ],

  viewModel: {
    data: {
      saveBtnText: 'Submit',
      userAnswer: null,
      gameId: null,
      waitingNextQuestion: false,
      selectedChoice: null,
      submittingAnswer: false
    },
    formulas: {
      hideAnswerField: function(get) {
        return get('isMultipleChoice');
      },
      isMultipleChoice: function(get) {
        return get('currentQuestion.Type') === Enums.RoundItemTypes.MULTIPLE_CHOICE;
      },
      loadingMask: function(get) {
        const answers = get('currentQuestion.Answers');
        const found = answers && answers.findRecord('GroupId', get('userProfile.CurrentGame.GroupId'), 0, false, true, true);
        if (found || get('submittingAnswer')) {
          this.set('userAnswer', found && found.get('Answer'));
          return {
            xtype: 'loadmask',
            message: 'Answer submitted...\nAwaiting next round.'
          };
        }
        this.set('userAnswer', null);
        return false;
      },
      currentQuestion: {
        bind: {
          bindTo: '{viewRecord.RoundItems}',
          deep: true
        },
        get: function(roundItemsStore) {
          const gameRecord = this.get('viewRecord');
          return gameRecord && gameRecord.getCurrentQuestionRecord();
        }
      }
    }
  },

  defaultListenerScope: true,
  isCrudDialog: true,
  height: '100%',
  width: '100%',
  layout: {
    type: 'vbox'
  },
  bind: {
    title: 'Round: {currentQuestion.RoundName || currentQuestion.Round}, Question: {currentQuestion.Order}',
    masked: '{loadingMask}'
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
    selectable: {
      mode: 'SINGLE'
    },
    bind: {
      store: '{currentQuestion.Choices}',
      hidden: '{!isMultipleChoice}',
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
  }],

  initialize: function() {
    const me = this;
    me.callParent();
    const vm = me.getViewModel();
    const choicesGrid = me.lookup('choicesGrid');
    if (vm) {
      JefBox.model.Game.load(vm.get('gameId'), {
        callback: function(record) {
          vm.set('viewRecord', record);
          record.connectSocket({
            after: function(record, successful) {
              if (choicesGrid) {
                Ext.asap(function() {
                  choicesGrid.forceRefresh();
                });
              }
              vm.set('submittingAnswer', false);
            }
          });
        }
      });
    }
  },

  submitAnswer: function() {
    const viewModel = this.getViewModel();
    const questionRecord = viewModel && viewModel.get('currentQuestion');
    if (questionRecord) {
      let choice;
      let answer = viewModel.get('userAnswer');
      if (viewModel.get('isMultipleChoice')) {
        const selectedChoice = viewModel.get('selectedChoice');
        choice = selectedChoice && selectedChoice.getId();
      }
      if (answer) {
        answer = answer.replace(/\s*$/, '');
      }
      viewModel.set('submittingAnswer', true);
      questionRecord.addAnswer({
        choiceId: choice,
        answer: answer
      });
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