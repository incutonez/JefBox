Ext.define('JefBox.view.games.HostView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.gamesHostView',
  requires: [
    'JefBox.view.teams.MainView',
    'JefBox.view.games.HostViewController'
  ],

  controller: {
    type: 'gamesHostView'
  },
  viewModel: {
    data: {
      viewRecordId: null,
      store: null
    },
    formulas: {
      entityText: function(get) {
        return get('viewRecord.AllowTeams') ? 'Teams' : 'Users';
      },
      currentQuestion: {
        bind: {
          bindTo: '{viewRecord.RoundItems}',
          deep: true
        },
        get: function(roundItemsStore) {
          if (roundItemsStore) {
            let questionIndex = roundItemsStore.findBy(function(r) {
              return Ext.isEmpty(r.get('AnswerDate'));
            });
            return roundItemsStore.getAt(questionIndex);
          }
        }
      },
      viewRecord: {
        bind: {
          bindTo: '{store}',
          deep: true
        },
        get: function(store) {
          return store && store.findRecord('Id', this.get('viewRecordId'), 0, false, true, true);
        }
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
          dataIndex: 'Name'
        }, {
          text: 'Users',
          dataIndex: 'Users',
          flex: 1,
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
          text: 'Next Question',
          iconCls: Icons.CHECKMARK_ROUND,
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
          xtype: 'displayfield',
          label: 'Answer',
          bind: {
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
        itemConfig: {
          viewModel: {
            formulas: {
              entityValue: function(get) {
                const id = get('record.UniqueId');
                console.log(id, get('viewRecord.AllowTeams'));
                return get('viewRecord.AllowTeams') ? JefBox.store.Teams.getTeamNameById(id) : JefBox.store.Users.getUserNameById(id);
              }
            }
          }
        },
        columns: [{
          dataIndex: 'UniqueId',
          flex: 1,
          bind: {
            text: '{entityText}'
          },
          cell: {
            bind: '{entityValue}'
          }
        }, {
          text: 'Answers',
          dataIndex: 'Answer',
          flex: 2
        }]
      }]
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
            handler: 'onMarkQuestionAnsweredRow',
            bind: {
              hidden: '{record.AnswerDate}'
            }
          }, {
            iconCls: Icons.CHECKMARK_ROUND_SOLID,
            tooltip: 'Mark Question Unanswered',
            handler: 'onMarkQuestionUnansweredRow',
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
      title: 'Standings'
    }]
  }]
});