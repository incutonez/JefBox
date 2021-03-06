Ext.define('JefBox.view.games.CurrentQuestionView', {
  extend: 'Ext.Panel',
  alias: 'widget.gamesCurrentQuestionView',
  requires: [
    'JefBox.YouTubeAudioButton'
  ],

  title: 'Current Question',
  layout: {
    type: 'hbox',
    align: 'stretch'
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
        disabled: '{isFirstQuestion}'
      }
    }, {
      type: 'next',
      tooltip: 'Next Question',
      handler: 'onClickNextQuestionBtn',
      bind: {
        disabled: '{isLastQuestion}'
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
      reference: 'choicesGrid',
      variableHeights: true,
      bind: {
        hidden: '{!showAnswer || !currentQuestion.IsMultipleChoice}',
        store: '{multipleAnswersStore}'
      },
      columns: [{
        text: 'Answers',
        flex: 1,
        dataIndex: 'Value',
        cell: {
          cls: Styles.GRID_CELL_OVERFLOW
        }
      }]
    }]
  }, {
    xtype: 'grid',
    flex: 1,
    title: 'Answers',
    margin: '0 0 0 5',
    variableHeights: true,
    bind: {
      store: '{answersStore}'
    },
    titleBar: {
      items: [{
        xtype: 'button',
        align: 'right',
        tooltip: 'Start Timer',
        handler: 'onClickStartTimer',
        bind: {
          iconCls: '{timerIconCls}',
          text: '{timeRemainingFm}',
          hidden: '{timeRemaining === null}',
          disabled: '{timeRemaining === 0 || timerTask}'
        }
      }, {
        xtype: 'button',
        text: 'Go Nuculer',
        tooltip: 'Teams with unsubmitted answers will have no answer for this round.',
        iconCls: Icons.NUCLEAR,
        handler: 'onClickGoNuclear',
        align: 'right',
        cls: Styles.COLOR_RADIATION,
        bind: {
          hidden: '{timeRemaining !== 0}'
        }
      }, {
        xtype: 'component',
        reference: 'timerOverAudio',
        hidden: true,
        html: '<audio controls><source src="../../../../../resources/time_over.mp3" type="audio/mpeg"></audio>'
      }, {
        xtype: 'button',
        tooltip: 'Submit Answers',
        text: 'Answers',
        iconCls: Icons.SEND,
        align: 'right',
        handler: 'onClickSubmitAnswers',
        bind: {
          disabled: '{!allAnswersSubmitted}'
        }
      }]
    },
    itemConfig: {
      viewModel: true
    },
    columns: [{
      text: 'Actions',
      align: 'right',
      width: 75,
      cell: {
        tools: [{
          iconCls: Icons.DELETE,
          tooltip: 'Delete Answer',
          handler: 'onDeleteAnswerRow'
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
      text: 'Is Correct',
      cell: {
        xtype: 'widgetcell',
        widget: {
          xtype: 'container',
          layout: {
            type: 'hbox'
          },
          items: [{
            xtype: 'checkbox',
            bind: {
              checked: '{record.IsCorrect}'
            }
          }, {
            xtype: 'numberfield',
            bind: {
              hidden: '{!record.IsCorrect}',
              value: '{record.Points}'
            }
          }]
        }
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
      },
      cell: {
        cls: Styles.GRID_CELL_OVERFLOW
      }
    }]
  }]
});