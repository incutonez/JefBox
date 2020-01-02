Ext.define('JefBox.view.games.RoundItemView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.gamesRoundItemView',
  requires: [
    'JefBox.model.Upload',
    'JefBox.view.uploads.EditView',
    'JefBox.view.uploads.ReadView'
  ],

  viewModel: {
    data: {
      viewRecord: null
    },
    formulas: {
      hideChoicesGrid: function(get) {
        return get('viewRecord.Type') !== Enums.RoundItemTypes.MULTIPLE_CHOICE;
      },
      hideMediaField: function(get) {
        const types = Enums.RoundItemTypes;
        return !Ext.Array.contains([types.AUDIO, types.IMAGE, types.VIDEO], get('viewRecord.Type'));
      }
    }
  },

  width: 300,
  height: 600,
  title: 'Round Item',
  minimizable: false,
  maximizable: false,
  isCrudDialog: true,
  bodyPadding: 10,
  referenceHolder: true,
  defaultListenerScope: true,
  layout: {
    type: 'vbox'
  },
  items: [{
    xtype: 'container',
    layout: {
      type: 'hbox'
    },
    items: [{
      xtype: 'container',
      flex: 1,
      margin: '0 5 0 0',
      layout: {
        type: 'vbox'
      },
      items: [{
        xtype: 'enumComboBox',
        store: Enums.RoundItemTypes,
        label: 'Type',
        bind: {
          value: '{viewRecord.Type}'
        }
      }, {
        xtype: 'numberfield',
        label: 'Points',
        minValue: -10,
        required: true,
        bind: {
          value: '{viewRecord.Points}'
        }
      }]
    }, {
      xtype: 'container',
      flex: 1,
      margin: '0 0 0 5',
      layout: {
        type: 'vbox'
      },
      items: [{
        xtype: 'numberfield',
        label: 'Round',
        minValue: 1,
        required: true,
        bind: {
          value: '{viewRecord.Round}'
        }
      }, {
        xtype: 'numberfield',
        label: 'Order',
        minValue: 1,
        required: true,
        bind: {
          value: '{viewRecord.Order}'
        }
      }]
    }]
  }, {
    xtype: 'textfield',
    label: 'Question',
    required: true,
    bind: {
      value: '{viewRecord.Question}'
    }
  }, {
    xtype: 'textfield',
    label: 'Answer',
    required: true,
    bind: {
      value: '{viewRecord.Answer}'
    }
  }, {
    xtype: 'grid',
    title: 'Choices',
    reference: 'choicesGrid',
    flex: 1,
    plugins: [{
      type: 'gridrowdragdrop'
    }, {
      type: 'rowedit',
      id: 'rowEditingPlugin'
    }],
    bind: {
      hidden: '{hideChoicesGrid}',
      store: '{viewRecord.Choices}'
    },
    listeners: {
      drop: 'onDropChoiceRecord',
      edit: 'onEditChoiceRow',
      canceledit: 'onCancelEditChoiceRow'
    },
    titleBar: {
      items: [{
        xtype: 'button',
        text: 'Choice',
        iconCls: Icons.NEW,
        align: 'right',
        handler: 'onClickNewChoiceBtn'
      }]
    },
    columns: [{
      text: 'Actions',
      align: 'right',
      width: 75,
      cell: {
        tools: [{
          tooltip: 'Edit Record',
          handler: 'onClickEditChoiceRow',
          iconCls: Icons.EDIT
        }, {
          tooltip: 'Delete Record',
          handler: 'onClickDeleteChoiceRow',
          iconCls: Icons.DELETE
        }]
      }
    }, {
      text: 'Order',
      dataIndex: 'Order',
      width: 80
    }, {
      text: 'Text',
      dataIndex: 'Value',
      flex: 1,
      editor: {
        xtype: 'textfield',
        required: true
      }
    }]
  }, {
    xtype: 'container',
    flex: 1,
    layout: {
      type: 'vbox'
    },
    bind: {
      hidden: '{hideMediaField}'
    },
    items: [{
      xtype: 'textfield',
      label: 'Url',
      bind: {
        disabled: '{viewRecord.UploadId}',
        value: '{viewRecord.Url}'
      }
    }, {
      xtype: 'container',
      layout: {
        type: 'hbox',
        align: 'left'
      },
      bind: {
        disabled: '{viewRecord.Url}'
      },
      items: [{
        xtype: 'button',
        iconCls: Icons.VIEW,
        handler: 'onClickViewAttachment',
        tooltip: 'View Attachment',
        bind: {
          hidden: '{!viewRecord.UploadId}'
        }
      }, {
        xtype: 'button',
        iconCls: Icons.DELETE,
        handler: 'onClickDeleteAttachment',
        tooltip: 'Delete Attachment',
        bind: {
          hidden: '{!viewRecord.UploadId}'
        }
      }, {
        xtype: 'button',
        text: 'Attachment',
        iconCls: Icons.NEW,
        handler: 'onClickAddAttachmentBtn',
        bind: {
          disabled: '{viewRecord.Url}'
        }
      }]
    }]
  }],

  onClickDeleteAttachment: function() {
    let viewRecord = this.getViewRecord();
    let uploadRecord = JefBox.store.Uploads.findRecord('Id', viewRecord && viewRecord.get('UploadId'), 0, false, true, true);
    if (uploadRecord) {
      uploadRecord.erase({
        callback: function(record, operation, success) {
          if (success) {
            viewRecord.set('UploadId', null);
          }
        }
      });
    }
  },

  onClickViewAttachment: function() {
    let viewRecord = this.getViewRecord();
    let uploadRecord = JefBox.store.Uploads.findRecord('Id', viewRecord && viewRecord.get('UploadId'), 0, false, true, true);
    if (uploadRecord) {
      Ext.create('JefBox.view.uploads.ReadView', {
        viewModel: {
          data: {
            viewRecord: uploadRecord
          }
        }
      });
    }
  },

  onClickAddAttachmentBtn: function() {
    Ext.create('JefBox.view.uploads.EditView', {
      listeners: {
        scope: this,
        uploaded: 'onUploadedAttachment'
      }
    });
  },

  onUploadedAttachment: function(result) {
    let viewRecord = this.getViewRecord();
    if (viewRecord && result) {
      viewRecord.set('UploadId', result.UploadId);
    }
  },

  onClickSaveBtn: function() {
    let viewRecord = this.getViewRecord();
    if (viewRecord) {
      viewRecord.commit();
    }
    this.clickedSave = true;
    this.fireEvent('clickSave', viewRecord);
    this.close();
  },

  onEditChoiceRow: function() {
    this.savingRecord = true;
  },

  onCancelEditChoiceRow: function(sender, location) {
    let record = location.record;
    if (!this.savingRecord && record.phantom && !record.isValid()) {
      record.store.remove(record);
    }
    this.savingRecord = false;
  },

  onClickDeleteChoiceRow: function(grid, info) {
    grid.store.remove(info.record);
  },

  onClickEditChoiceRow: function(grid, info) {
    let choicesGrid = this.lookup('choicesGrid');
    let choicesGridEditor = choicesGrid && choicesGrid.getPlugin('rowEditingPlugin');
    if (choicesGridEditor) {
      choicesGridEditor.startEdit(info.record);
    }
  },

  onClickNewChoiceBtn: function() {
    let viewRecord = this.getViewRecord();
    let choicesGrid = this.lookup('choicesGrid');
    let choicesGridEditor = choicesGrid && choicesGrid.getPlugin('rowEditingPlugin');
    let store = viewRecord && viewRecord.getChoicesStore();
    if (store && choicesGridEditor) {
      let added = store.add({
        Order: store.getCount() + 1
      });
      choicesGridEditor.startEdit(added[0]);
    }
  },

  onDropChoiceRecord: function(node, data, overModel, dropPosition, eOpts) {
    let me = this;
    let record = data.records[0];
    let viewRecord = me.getViewRecord();
    let store = viewRecord && viewRecord.getChoicesStore();
    if (record && overModel && store) {
      // Need to insert before if we're dropping it before
      let sign = dropPosition === 'before' ? -1 : 0;
      let previousOrder = 1;
      record.set({
        Order: overModel.get('Order') + sign
      });
      store.insert(record.get('Order'), record);
      store.each(function(record) {
        record.set('Order', previousOrder++);
      });
    }
  }
});