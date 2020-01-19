Ext.define('JefBox.view.uploads.EditView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.uploadsEditView',

  viewModel: {
    data: {
      saveBtnText: 'Upload'
    }
  },

  referenceHolder: true,
  defaultListenerScope: true,
  title: 'Upload File',
  bodyPadding: 10,
  height: 200,
  width: 400,
  isCrudDialog: true,
  layout: {
    type: 'vbox'
  },
  items: [{
    xtype: 'formpanel',
    bodyPadding: 0,
    reference: 'uploadForm',
    layout: {
      type: 'hbox',
      align: 'end'
    },
    items: [{
      xtype: 'filefield',
      label: 'Attachment',
      name: 'uploadFile',
      flex: 1,
      listeners: {
        initialize: 'onPaintedAttachmentField'
      }
    }]
  }],

  onPaintedAttachmentField: function(field) {
    const fileButton = field.getFileButton();
    if (fileButton) {
      fileButton.setIconCls(Icons.SEARCH);
      fileButton.setText(null);
    }
  },

  onClickSaveBtn: function() {
    const me = this;
    const uploadForm = me.lookup('uploadForm');
    if (uploadForm) {
      me.clickedSave = true;
      uploadForm.submit({
        url: 'api/uploads',
        waitMsg: 'Uploading...',
        success: function(form, result, data) {
          me.fireEvent('uploaded', result);
          me.close();
        }
      });
    }
  }
});