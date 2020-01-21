Ext.define('JefBox.view.PainterView', {
  extend: 'Ext.Panel',
  alias: 'widget.painterView',
  requires: [
    'JefBox.Painter'
  ],

  viewModel: {
    data: {
      hideSaveBtn: false,
      selectedColor: '#000000'
    }
  },

  layout: 'fit',
  referenceHolder: true,
  defaultListenerScope: true,
  tools: [{
    xtype: 'textfield',
    inputType: 'color',
    bind: {
      value: '{selectedColor}'
    }
  }, {
    xtype: 'button',
    tooltip: 'Undo',
    iconCls: Icons.UNDO,
    handler: 'onClickUndoBtn'
  }, {
    xtype: 'button',
    tooltip: 'Clear',
    iconCls: Icons.CLEAR,
    handler: 'onClickClearBtn'
  }, {
    xtype: 'button',
    text: 'Save',
    iconCls: Icons.SAVE,
    handler: 'onClickSaveBtn',
    bind: {
      hidden: '{hideSaveBtn}'
    }
  }],
  items: [{
    xtype: 'painter',
    reference: 'painter',
    bind: {
      strokeStyle: '{selectedColor}'
    }
  }],

  uploadImage: function(config) {
    const painter = this.lookup('painter');
    config = config || {};
    if (painter) {
      painter.saveImage(function(response, successful) {
        const toastMsg = response && response.getToastMsg({
          entityType: 'image'
        });
        if (toastMsg) {
          Ext.toast(toastMsg);
        }
        Ext.callback(config.callback, config.scope, [response, successful]);
      });
    }
  },

  onClickUndoBtn: function() {
    const painter = this.lookup('painter');
    if (painter) {
      painter.undoLast();
    }
  },

  onClickClearBtn: function() {
    const painter = this.lookup('painter');
    if (painter) {
      painter.clearImage();
    }
  },

  onClickSaveBtn: function() {
    this.uploadImage();
  }
});