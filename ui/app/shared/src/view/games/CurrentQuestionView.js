Ext.define('JefBox.view.games.CurrentQuestionView', {
  extend: 'Ext.Panel',
  alias: 'widget.gamesCurrentQuestionView',

  title: 'Current Question',
  layout: {
    type: 'hbox'
  },
  items: [{
    xtype: 'panel',
    padding: 10,
    flex: 1,
    title: 'Info',
    layout: {
      type: 'vbox'
    },
    tools: [{
      xtype: 'button',
      tooltip: 'Previous Question',
      iconCls: Icons.ARROW_LEFT,
      handler: 'onClickPreviousQuestionBtn'
    }, {
      xtype: 'button',
      tooltip: 'Next Question',
      iconCls: Icons.ARROW_RIGHT,
      handler: 'onClickNextQuestionBtn'
    }],
    defaults: {
      labelWidth: 110,
      labelAlign: 'left'
    },
    items: [{
      xtype: 'displayfield',
      label: 'Round',
      bind: {
        value: '{currentQuestion.Round}'
      }
    }, {
      xtype: 'displayfield',
      label: 'Question Number',
      bind: {
        value: '{currentQuestion.Order}'
      }
    }, {
      xtype: 'displayfield',
      label: 'Type',
      bind: {
        value: '{currentQuestion.TypeDisplay}'
      }
    }, {
      xtype: 'displayfield',
      label: 'Question',
      bind: {
        value: '{currentQuestion.Question}'
      }
    }, {
      xtype: 'displayfield',
      label: 'Answer',
      bind: {
        value: '{currentQuestion.Answer}'
      }
    }, {
      xtype: 'component',
      // TODOJEF: Fix
      html: '<iframe width="560" height="315" src="http://www.youtube.com/embed/fgT9zGkiLig" frameborder="0" allowfullscreen></iframe>'
      // bind: {
      //   url: '{currentQuestion.Url}'
      // }
    }]
  }, {
    xtype: 'grid',
    flex: 1,
    title: 'Answers',
    bind: {
      store: '{currentQuestion.Answers}'
    },
    titleBar: {
      items: [{
        xtype: 'button',
        text: 'Submit Answers',
        align: 'right',
        handler: 'onClickSubmitAnswers'
      }]
    },
    itemConfig: {
      viewModel: {
        formulas: {
          entityValue: function(get) {
            return get('viewRecord.AllowTeams') ? JefBox.store.Teams.getTeamNameById(get('record.TeamId')) : JefBox.store.Users.getUserNameById(get('record.UserId'));
          },
          answerDisplay: function(get) {
            return get('record.ChoiceDisplay') || get('record.Answer');
          }
        }
      }
    },
    columns: [{
      text: 'Actions',
      cell: {
        tools: [{
          iconCls: Icons.CHECKMARK_ROUND,
          tooltip: 'Mark Correct',
          handler: 'onClickMarkAnswerCorrect',
          bind: {
            hidden: '{record.IsCorrect}'
          }
        }, {
          iconCls: Icons.CHECKMARK_ROUND_SOLID,
          tooltip: 'Mark Incorrect',
          handler: 'onClickMarkAnswerIncorrect',
          bind: {
            hidden: '{!record.IsCorrect}'
          }
        }]
      }
    }, {
      flex: 1,
      bind: {
        text: '{entityText}'
      },
      cell: {
        bind: '{entityValue}'
      }
    }, {
      text: 'Answers',
      flex: 2,
      cell: {
        bind: {
          value: '{answerDisplay}'
        }
      }
    }]
  }]
});