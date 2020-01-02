Ext.define('JefBox.model.Upload', {
  extend: 'JefBox.model.Crud',

  fields: [{
    name: 'FileName',
    type: 'string'
  }, {
    name: 'MimeType',
    type: 'string'
  }, {
    name: 'Data',
    type: 'string'
  }, {
    name: 'displayValue',
    type: 'string',
    persist: false,
    depends: ['MimeType', 'Data'],
    convert: function(value, record) {
      let data = record.get('Data');
      if (data) {
        return '<img height="30" src="data:' + record.get('MimeType') + ';base64, ' + data + '" />';
      }
    }
  }],

  proxy: {
    type: 'rest',
    url: 'api/upload'
  }
});