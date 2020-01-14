Ext.define('JefBox.view.games.CurrentQuestionView', {
  extend: 'Ext.Panel',
  alias: 'widget.gamesCurrentQuestionView',
  requires: [
    'JefBox.YouTubeAudioButton'
  ],

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
      label: 'Question',
      bind: {
        value: '{currentQuestion.Question}'
      }
    }, {
      xtype: 'container',
      layout: {
        type: 'hbox'
      },
      items: [{
        xtype: 'displayfield',
        label: 'Type',
        labelWidth: 110,
        labelAlign: 'left',
        bind: {
          value: '{currentQuestion.TypeDisplay}'
        }
      }, {
        xtype: 'youTubeAudioButton',
        bind: {
          hidden: '{!currentQuestion.youtubeVideoId}',
          videoId: '{currentQuestion.youtubeVideoId}'
        }
      }]
    }, {
      xtype: 'segmentedbutton',
      maxWidth: 100,
      bind: {
        value: '{showAnswer}'
      },
      items: [{
        tooltip: 'Hide Answer',
        iconCls: Icons.HIDE
      }, {
        tooltip: 'Show Answer',
        iconCls: Icons.SHOW
      }]
    }, {
      xtype: 'displayfield',
      label: 'Answer',
      bind: {
        hidden: '{!showAnswer}',
        value: '{currentQuestion.Answer}'
      }
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
        tooltip: 'Submit Answers',
        text: 'Answers',
        iconCls: Icons.SEND,
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
      },
      bind: {
        hidden: '{hideAnswersColumn}'
      }
    }]
  }]
});