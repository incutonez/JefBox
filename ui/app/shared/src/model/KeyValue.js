Ext.define('JefBox.model.KeyValue', {
  extend: 'Ext.data.Model',

  idProperty: 'Key',
  fields: [{
    name: 'Key',
    type: 'string'
  }, {
    name: 'Value',
    type: 'int'
  }, {
    name: 'Description',
    type: 'string',
    persist: false
  }],

  proxy: {
    type: 'memory'
  }
});