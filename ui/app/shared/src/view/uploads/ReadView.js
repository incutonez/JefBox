Ext.define('JefBox.view.uploads.ReadView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.uploadsReadView',

  height: 400,
  width: 400,
  layout: 'fit',
  items: [{
    xtype: 'component',
    bind: {
      html: '<img style="max-width: 100%; max-height: 100%;" src="data:{viewRecord.MimeType};base64, {viewRecord.Data}" />'
    }
  }]
});