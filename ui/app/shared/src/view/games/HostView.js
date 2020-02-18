Ext.define('JefBox.view.games.HostView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.gamesHostView',
  requires: [
    'JefBox.view.teams.MainView',
    'JefBox.view.games.HostViewController',
    'JefBox.view.games.CurrentQuestionView',
    'JefBox.view.games.HostViewModel'
  ],

  controller: {
    type: 'gamesHostView'
  },
  viewModel: {
    type: 'gamesHostView'
  },

  width: '90%',
  height: '90%',
  maximized: true,
  bodyPadding: 0,
  bind: {
    title: 'Game: {viewRecord.Name}',
    masked: '{loadingMask}'
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
          store: '{teamsStore}'
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
          text: 'Actions',
          align: 'right',
          width: 75,
          cell: {
            tools: [{
              iconCls: Icons.DELETE,
              tooltip: 'Remove Team',
              handler: 'onRemoveTeamRow'
            }]
          }
        }, {
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
          store: '{usersStore}'
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
      title: 'Standings',
      xtype: 'grid',
      grouped: true,
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
        store: '{scoreStore}'
      },
      titleBar: {
        items: [{
          xtype: 'button',
          align: 'right',
          text: 'Announce Winner',
          iconCls: Icons.ANNOUNCE,
          handler: 'onClickAnnounceWinner',
          bind: {
            disabled: '{!isLastQuestion}'
          }
        }]
      },
      columns: [{
        text: 'Round',
        dataIndex: 'Round'
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