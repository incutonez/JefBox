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
      viewRecord: null,
      createAnotherQuestion: false
    },
    formulas: {
      hideMediaField: function(get) {
        const types = Enums.RoundItemTypes;
        return !Ext.Array.contains([types.AUDIO, types.IMAGE, types.VIDEO], get('viewRecord.Type'));
      },
      saveBtnDisabled: function(get) {
        const isMultipleChoice = get('viewRecord.IsMultipleChoice');
        return !get('viewRecord.valid') || isMultipleChoice && !get('viewRecord.Choices.count') || !isMultipleChoice && Ext.isEmpty(get('viewRecord.Answer'));
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
  bbar: {
    layout: {
      type: 'hbox',
      pack: 'end'
    },
    items: [{
      xtype: 'checkbox',
      label: 'Create Another',
      align: 'right',
      bind: {
        checked: '{createAnotherQuestion}'
      }
    }]
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
        xtype: 'textfield',
        label: 'Round',
        required: true,
        bind: {
          value: '{viewRecord.Round}'
        }
      }, {
        xtype: 'numberfield',
        label: 'Points',
        minValue: -1000,
        required: true,
        bind: {
          value: '{viewRecord.Points}'
        }
      }, {
        xtype: 'enumComboBox',
        store: Enums.RoundItemTypes,
        label: 'Type',
        bind: {
          value: '{viewRecord.Type}'
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
        label: 'Order',
        minValue: 1,
        required: true,
        bind: {
          value: '{viewRecord.Order}'
        }
      }, {
        xtype: 'numberfield',
        label: 'Time Limit (in seconds)',
        minValue: 0,
        bind: {
          value: '{viewRecord.TimeLimit}'
        }
      }, {
        xtype: 'checkbox',
        label: 'Multiple Choice',
        labelAlign: 'top',
        bind: {
          checked: '{viewRecord.IsMultipleChoice}'
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
    const me = this;
    const viewModel = me.getViewModel();
    const viewRecord = me.getViewRecord();
    if (viewRecord) {
      viewRecord.commit();
    }
    me.clickedSave = true;
    me.fireEvent('clickSave', viewRecord);
    if (viewModel && viewModel.get('createAnotherQuestion')) {
      this.createNewQuestion();
      return;
    }
    me.close();
  },

  createNewQuestion: function() {
    const viewModel = this.getViewModel();
    const viewRecord = this.getViewRecord();
    if (viewRecord) {
      viewModel.set('viewRecord', JefBox.model.game.RoundItem.loadData({
        Order: viewRecord.get('Order') + 1 || 1,
        Round: viewRecord.get('Round') || 1
      }));
    }
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