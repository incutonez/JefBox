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
    margin: '0 5 0 0',
    layout: {
      type: 'vbox'
    },
    tools: [{
      type: 'prev',
      tooltip: 'Previous Question',
      handler: 'onClickPreviousQuestionBtn',
      bind: {
        disabled: '{viewRecord.RoundItems.first === currentQuestion}'
      }
    }, {
      type: 'next',
      tooltip: 'Next Question',
      handler: 'onClickNextQuestionBtn',
      bind: {
        disabled: '{viewRecord.RoundItems.last === currentQuestion}'
      }
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
          hidden: '{!isAudio}',
          videoId: '{currentQuestion.youtubeVideoId}'
        }
      }, {
        xtype: 'button',
        tooltip: 'View',
        iconCls: Icons.VIEW,
        handler: 'onClickViewMediaButton',
        bind: {
          hidden: '{!isImageVideo}'
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
        hidden: '{!showAnswer || currentQuestion.IsMultipleChoice}',
        value: '{currentQuestion.Answer}'
      }
    }, {
      xtype: 'grid',
      flex: 1,
      bind: {
        hidden: '{!showAnswer || !currentQuestion.IsMultipleChoice}',
        store: '{multipleAnswersStore}'
      },
      columns: [{
        text: 'Answers',
        flex: 1,
        dataIndex: 'Value'
      }]
    }]
  }, {
    xtype: 'grid',
    flex: 1,
    title: 'Answers',
    margin: '0 0 0 5',
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
      viewModel: true
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
        }, {
          iconCls: Icons.VIEW,
          tooltip: 'View Image',
          handler: 'onClickViewImage',
          bind: {
            hidden: '{!record.UploadId}'
          }
        }]
      }
    }, {
      flex: 1,
      dataIndex: 'GroupName',
      bind: {
        text: '{entityText}'
      }
    }, {
      text: 'Answers',
      flex: 2,
      dataIndex: 'Answer',
      bind: {
        hidden: '{hideAnswersColumn}'
      }
    }]
  }]
});