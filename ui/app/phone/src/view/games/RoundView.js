Ext.define('JefBox.phone.view.games.RoundView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.phoneGamesRoundView',

  viewModel: {
    data: {
      saveBtnText: 'Submit',
      userAnswer: null,
      gameId: null,
      gamesStore: JefBox.store.Games
    },
    formulas: {
      viewRecord: {
        bind: {
          bindTo: '{gamesStore}',
          deep: true
        },
        get: function(gamesStore) {
          return gamesStore && gamesStore.findRecord('Id', this.get('gameId'), 0, false, true, true);
        }
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
            return roundItemsStore.getAt(questionIndex);
          }
        }
      }
    }
  },

  isCrudDialog: true,
  bind: {
    title: 'Round: {currentQuestion.RoundName || currentQuestion.Round}, Question: {currentQuestion.Order}'
  },
  items: [{
    xtype: 'textfield',
    label: 'Your Answer',
    bind: {
      value: '{userAnswer}'
    }
  }],

  onClickSaveBtn: function() {
    const viewModel = this.getViewModel();
    const questionRecord = viewModel && viewModel.get('currentQuestion');
    if (questionRecord) {
      questionRecord.addAnswer({
        answer: viewModel.get('userAnswer'),
        callback: function(successful, response) {
          console.log(successful);
        }
      });
    }
  }
});