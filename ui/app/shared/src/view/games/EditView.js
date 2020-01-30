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

  isCrudDialog: true,
  bodyPadding: 0,
  bind: {
    title: 'Game: {viewRecord.Name}'
  },
  items: [{
    xtype: 'container',
    layout: {
      type: 'vbox'
    },
    items: [{
      xtype: 'container',
      margin: '0 0 0 10',
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
        margin: '0 10 0 0',
        bind: {
          value: '{viewRecord.Room}'
        }
      }, {
        xtype: 'checkbox',
        label: 'Teams',
        labelAlign: 'top',
        bind: {
          checked: '{viewRecord.AllowTeams}'
        }
      }]
    }, {
      xtype: 'grid',
      title: 'Rounds',
      flex: 1,
      margin: '10 0 0 0',
      grouped: true,
      reference: 'roundsGrid',
      groupHeader: {
        tpl: 'Round: {name}',
        tools: {
          edit: {
            zone: 'tail',
            tooltip: 'Edit Round',
            handler: 'onClickEditRound'
          }
        }
      },
      plugins: [{
        type: 'gridrowdragdrop'
      }],
      bind: {
        title: 'Rounds, Total Questions: {viewRecord.RoundItems.count}',
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
});