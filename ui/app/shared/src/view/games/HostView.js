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
      title: 'Game',
      xtype: 'accordion',
      items: [{
        xtype: 'panel',
        flex: 1,
        title: 'Current Question',
        collapsible: true,
        items: [{
          xtype: 'displayfield',
          bind: {
            value: '{currentQuestion.Question}'
          }
        }]
      }, {
        xtype: 'panel',
        title: 'Rounds',
        flex: 1,
        layout: 'fit',
        items: [{
          xtype: 'grid',
          grouped: true,
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
        }]
      }]
    }, {
      title: 'Standings'
    }]
  }]
});