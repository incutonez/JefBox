Ext.define('JefBox.view.games.HostView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.gamesHostView',
  requires: [
    'JefBox.view.teams.MainView',
    'JefBox.view.games.HostViewController',
    'JefBox.view.games.CurrentQuestionView'
  ],

  bodyPadding: 0,
  controller: {
    type: 'gamesHostView'
  },
  viewModel: {
    data: {
      showAnswer: 0,
      viewRecordId: null,
      viewRecord: null
    },
    formulas: {
      groupHeaderTpl: function(get) {
        return get('entityTextSingular') + ' {name} ' + get('standingsSum');
      },
      entityTextSingular: function(get) {
        return get('viewRecord.AllowTeams') ? 'Team' : 'User';
      },
      entityText: function(get) {
        return get('entityTextSingular') + 's';
      },
      standingsSum: function(get) {
        // This count is mainly here to trigger the binding instead of doing deep binding
        const count = get('viewRecord.Score.count');
        const scoreStore = get('viewRecord.Score');
        return scoreStore && scoreStore.sum('Points', true);
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
      },
      // Don't show the Answers column until all Answers have been submitted
      hideAnswersColumn: function(get) {
        return get('currentQuestion.Answers.count') !== get('viewRecord.Teams.count');
      },
      isImageVideo: function(get) {
        const types = Enums.RoundItemTypes;
        return Ext.Array.contains([types.IMAGE, types.VIDEO], get('currentQuestion.Type'));
      }
    }
  },

  layout: 'fit',
  bind: {
    title: 'Game: {viewRecord.Name}'
  },
  items: [{
    xtype: 'tabpanel',
    tabBar: {
      layout: {
        pack: 'start'
      }
    },
    items: [{
      title: 'Lobby',
      layout: {
        type: 'vbox'
      },
      items: [{
        xtype: 'grid',
        flex: 1,
        title: 'Teams',
        bind: {
          hidden: '{!viewRecord.AllowTeams}',
          store: '{viewRecord.Teams}'
        },
        itemConfig: {
          viewModel: {
            formulas: {
              usersDisplay: function(get) {
                return Ext.util.Format.storeToList({
                  store: get('record.Users'),
                  fields: 'UserName'
                });
              }
            }
          }
        },
        columns: [{
          text: 'Name',
          dataIndex: 'Name',
          flex: 1
        }, {
          text: 'Users',
          dataIndex: 'Users',
          flex: 2,
          cell: {
            encodeHtml: false,
            bind: {
              value: '{usersDisplay}'
            }
          }
        }]
      }, {
        xtype: 'grid',
        flex: 1,
        title: 'Users',
        bind: {
          hidden: '{viewRecord.AllowTeams}',
          store: '{viewRecord.Users}'
        },
        columns: [{
          text: 'Online',
          dataIndex: 'onlineCls',
          align: 'center',
          cell: {
            encodeHtml: false
          }
        }, {
          text: 'Name',
          dataIndex: 'UserName',
          flex: 1
        }]
      }]
    }, {
      xtype: 'gamesCurrentQuestionView'
    }, {
      xtype: 'grid',
      grouped: true,
      tab: {
        title: 'Rounds'
      },
      groupHeader: {
        tpl: 'Round: {name}'
      },
      bind: {
        store: '{viewRecord.RoundItems}'
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
            iconCls: Icons.CHECKMARK_ROUND,
            tooltip: 'Mark Question Answered',
            handler: 'onMarkRoundItemRow',
            bind: {
              hidden: '{record.AnswerDate}'
            }
          }, {
            iconCls: Icons.CHECKMARK_ROUND_SOLID,
            tooltip: 'Mark Question Unanswered',
            handler: 'onUnmarkRoundItemRow',
            bind: {
              hidden: '{!record.AnswerDate}'
            }
          }]
        }
      }, {
        text: 'Order',
        dataIndex: 'Order'
      }, {
        text: 'Type',
        dataIndex: 'Type',
        width: 120,
        renderer: function(value) {
          return Enums.RoundItemTypes.getDisplayValue(value);
        }
      }, {
        text: 'Question',
        dataIndex: 'Question',
        flex: 1
      }, {
        text: 'Points',
        dataIndex: 'Points'
      }]
    }, {
      title: 'Standings',
      xtype: 'grid',
      grouped: true,
      // TODOJEF: Make better
      groupHeader: {
        tpl: Ext.create('Ext.XTemplate', '{[this.getMarkup(values)]}', {
          getMarkup: function(values) {
            let points = 0;
            const children = values.children;
            if (children) {
              for (let i = 0; i < children.length; i++) {
                points += children[i].get('Points');
              }
            }
            return values.name + ' (' + points + ' points)';
          }
        })
      },
      bind: {
        store: '{viewRecord.Score}'
      },
      columns: [{
        text: 'Round',
        dataIndex: 'RoundNumber'
      }, {
        text: 'Question',
        dataIndex: 'QuestionNumber'
      }, {
        text: 'Points',
        dataIndex: 'Points'
      }]
    }]
  }]
});