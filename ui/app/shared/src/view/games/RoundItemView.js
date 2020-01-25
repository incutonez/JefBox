Ext.define('JefBox.view.games.RoundItemView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.gamesRoundItemView',
  requires: [
    'JefBox.model.Upload',
    'JefBox.view.uploads.EditView',
    'JefBox.view.uploads.MediaViewer'
  ],

  viewModel: {
    data: {
      viewRecord: null
    },
    formulas: {
      hideMediaField: function(get) {
        const types = Enums.RoundItemTypes;
        return !Ext.Array.contains([types.AUDIO, types.IMAGE, types.VIDEO], get('viewRecord.Type'));
      }
    }
  },

  width: 400,
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
        xtype: 'textfield',
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
    bind: {
      value: '{viewRecord.Answer}',
      disabled: '{viewRecord.IsMultipleChoice}',
      required: '{!viewRecord.IsMultipleChoice}'
    }
  }, {
    xtype: 'checkbox',
    boxLabel: 'Multiple Choice',
    bind: {
      checked: '{viewRecord.IsMultipleChoice}'
    }
  }, {
    xtype: 'grid',
    title: 'Choices',
    reference: 'choicesGrid',
    flex: 1,
    sortable: false,
    columnMenu: false,
    itemConfig: {
      viewModel: true
    },
    plugins: [{
      type: 'gridrowdragdrop'
    }, {
      type: 'gridcellediting',
      id: 'editingPlugin'
    }],
    bind: {
      hidden: '{!viewRecord.IsMultipleChoice}',
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
      text: '',
      width: 35,
      minWidth: 35,
      cell: {
        tools: [{
          tooltip: 'Delete Record',
          handler: 'onClickDeleteChoiceRow',
          iconCls: Icons.DELETE
        }]
      }
    }, {
      // TODO: get this to center the checkbox
      text: 'Answer',
      width: 70,
      align: 'center',
      cell: {
        xtype: 'widgetcell',
        widget: {
          xtype: 'checkbox',
          bind: {
            checked: '{record.IsAnswer}'
          }
        }
      }
    }, {
      text: 'Order',
      dataIndex: 'Order',
      align: 'center',
      width: 60
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
      xtype: 'displayfield',
      label: 'Video ID',
      bind: {
        hidden: '{!viewRecord.Url}',
        value: '{viewRecord.VideoId}'
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
    const viewRecord = this.getViewRecord();
    const uploadRecord = JefBox.store.Uploads.findRecord('Id', viewRecord && viewRecord.get('UploadId'), 0, false, true, true);
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
    const viewRecord = this.getViewRecord();
    Ext.create('JefBox.view.uploads.MediaViewer', {
      viewModel: {
        data: {
          uploadId: viewRecord && viewRecord.get('UploadId')
        }
      }
    });
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
    const viewRecord = this.getViewRecord();
    if (viewRecord && result) {
      viewRecord.set('UploadId', result.UploadId);
    }
  },

  onClickSaveBtn: function() {
    const viewRecord = this.getViewRecord();
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
    const record = location.record;
    if (!this.savingRecord && record.phantom && !record.isValid()) {
      record.store.remove(record);
    }
    this.savingRecord = false;
  },

  onClickDeleteChoiceRow: function(grid, info) {
    grid.store.remove(info.record);
  },

  onClickNewChoiceBtn: function() {
    const viewRecord = this.getViewRecord();
    const choicesGrid = this.lookup('choicesGrid');
    const choicesGridEditor = choicesGrid && choicesGrid.getPlugin('editingPlugin');
    const store = viewRecord && viewRecord.getChoicesStore();
    if (store && choicesGridEditor) {
      const added = store.add({
        Order: store.getCount() + 1
      });
      choicesGridEditor.startEdit(added[0], 3);
    }
  },

  onDropChoiceRecord: function(node, data, overModel, dropPosition, eOpts) {
    const me = this;
    const record = data.records[0];
    const viewRecord = me.getViewRecord();
    const store = viewRecord && viewRecord.getChoicesStore();
    if (record && overModel && store) {
      // Need to insert before if we're dropping it before
      const sign = dropPosition === 'before' ? -1 : 0;
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