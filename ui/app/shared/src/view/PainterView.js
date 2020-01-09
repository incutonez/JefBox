Ext.define('JefBox.view.PainterView', {
  extend: 'Ext.Panel',
  alias: 'widget.painterView',
  requires: [
    'JefBox.Painter'
  ],

  viewModel: {
    data: {
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
    text: 'Save',
    iconCls: Icons.SAVE,
    handler: 'onClickSaveBtn'
  }],
  items: [{
    xtype: 'painter',
    reference: 'painter',
    bind: {
      strokeStyle: '{selectedColor}'
    }
  }],

  onClickSaveBtn: function() {
    const painter = this.lookup('painter');
    if (painter) {
      painter.saveImage(function(response, successful) {
        const toastMsg = response && response.getToastMsg({
          entityType: 'image'
        });
        if (toastMsg) {
          Ext.toast(toastMsg);
        }
      });
    }
  }
});