Ext.define('JefBox.view.games.EditView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.gamesEditView',
  requires: [
    'JefBox.view.games.EditViewController',
    'JefBox.view.teams.SelectView'
  ],

  viewModel: {
    data: {
      viewRecord: null
    },
    formulas: {
      hideRoundItems: function(get) {
        return get('viewRecord.Type') !== Enums.GameTypes.TRIVIA;
      },
      saveBtnDisabled: function(get) {
        return !get('viewRecord.valid');
      }
    }
  },
  controller: {
    type: 'gamesEditView'
  },

  title: 'Games',
  isCrudDialog: true,
  items: [{
    xtype: 'tabpanel',
    tabBarPosition: 'left',
    tabRotation: 'none',
    defaults: {
      tab: {
        height: 50,
        width: 50,
        flex: null
      }
    },
    tabBar: {
      layout: {
        pack: 'start'
      }
    },
    items: [{
      iconCls: Icons.INFO,
      bodyPadding: '0 0 0 10',
      layout: {
        type: 'vbox'
      },
      items: [{
        xtype: 'container',
        layout: {
          type: 'hbox'
        },
        items: [{
          xtype: 'textfield',
          label: 'Name',
          required: true,
          margin: '0 10 0 0',
          bind: {
            value: '{viewRecord.Name}'
          }
        }, {
          xtype: 'enumComboBox',
          label: 'Type',
          store: Enums.GameTypes,
          margin: '0 10 0 0',
          bind: {
            value: '{viewRecord.Type}'
          }
        }, {
          xtype: 'textfield',
          label: 'Room',
          bind: {
            value: '{viewRecord.Room}'
          }
        }]
      }, {
        xtype: 'grid',
        title: 'Items',
        flex: 1,
        margin: '10 0 0 0',
        grouped: true,
        groupHeader: {
          tpl: 'Round: {name}'
        },
        plugins: [{
          type: 'gridrowdragdrop'
        }],
        bind: {
          hidden: '{hideRoundItems}',
          store: '{viewRecord.RoundItems}'
        },
        listeners: {
          drop: 'onDropQuestionRecord'
        },
        titleBar: {
          items: [{
            xtype: 'button',
            text: 'Round Item',
            align: 'right',
            iconCls: Icons.NEW,
            handler: 'onClickAddQuestionBtn'
          }]
        },
        columns: [{
          text: 'Actions',
          align: 'right',
          width: 75,
          cell: {
            tools: [{
              iconCls: Icons.EDIT,
              tooltip: 'Edit Round Item',
              handler: 'onEditQuestionRow'
            }, {
              iconCls: Icons.DELETE,
              tooltip: 'Delete Round Item',
              handler: 'onDeleteQuestionRow'
            }]
          }
        }, {
          text: 'Order',
          dataIndex: 'Order'
        }, {
          text: 'Type',
          dataIndex: 'Type',
          renderer: function(value) {
            return Enums.RoundItemTypes.getDisplayValue(value);
          }
        }, {
          text: 'Question',
          dataIndex: 'Question',
          flex: 1
        }]
      }]
    }, {
      xtype: 'teamsSelectView',
      iconCls: Icons.TEAMS
    }]
  }]
});