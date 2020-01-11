Ext.define('JefBox.phone.view.games.RoundView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.phoneGamesRoundView',

  viewModel: {
    data: {
      saveBtnText: 'Submit',
      userAnswer: null,
      gameId: null,
      waitingNextQuestion: false,
      gamesStore: JefBox.store.Games,
      currentRoundId: null,
      selectedChoice: null
    },
    formulas: {
      hideAnswerField: function(get) {
        return get('isMultipleChoice');
      },
      isMultipleChoice: function(get) {
        return get('currentQuestion.Type') === Enums.RoundItemTypes.MULTIPLE_CHOICE;
      },
      viewRecord: {
        bind: {
          bindTo: '{gamesStore}',
          deep: true
        },
        get: function(gamesStore) {
          return gamesStore && gamesStore.findRecord('Id', this.get('gameId'), 0, false, true, true);
        }
      },
      loadingMask: function(get) {
        return !Ext.isEmpty(get('currentRoundId'));
      },
      currentQuestion: {
        bind: {
          bindTo: '{viewRecord.RoundItems}',
          deep: true
        },
        get: function(roundItemsStore) {
          if (roundItemsStore) {
            const questionIndex = roundItemsStore.findBy(function(r) {
              return Ext.isEmpty(r.get('AnswerDate'));
            });
            const roundItem = roundItemsStore.getAt(questionIndex);
            if (roundItem && roundItem.getId() !== this.get('currentRoundId')) {
              this.set({
                currentRoundId: null,
                userAnswer: null,
                selectedChoice: null
              });
            }
            return roundItem;
          }
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