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
      currentRoundId: null,
      selectedChoice: null,
      userRecord: UserProfile
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
        console.log(answers, get('userRecord'));
        return !Ext.isEmpty(get('currentRoundId'));
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

  isCrudDialog: true,
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
    bind: {
      value: '{userAnswer}',
      hidden: '{hideAnswerField}'
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
          record.connectSocket(function(record, successful) {
            if (choicesGrid) {
              Ext.asap(function() {
                choicesGrid.forceRefresh();
              });
            }
          });
        }
      });
    }
  },

  onClickSaveBtn: function() {
    const viewModel = this.getViewModel();
    const questionRecord = viewModel && viewModel.get('currentQuestion');
    if (questionRecord) {
      let choice;
      if (viewModel.get('isMultipleChoice')) {
        const selectedChoice = viewModel.get('selectedChoice');
        choice = selectedChoice && selectedChoice.getId();
      }
      viewModel.set('currentRoundId', questionRecord.getId());
      questionRecord.addAnswer({
        choiceId: choice,
        answer: viewModel.get('userAnswer'),
        callback: function(successful, response) {
          console.log(successful);
        }
      });
    }
  }
});