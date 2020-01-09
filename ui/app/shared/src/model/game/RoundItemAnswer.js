Ext.define('JefBox.model.game.RoundItemAnswer', {
  extend: 'Ext.data.Model',

  idProperty: 'Id',
  identifier: 'negative',
  fields: [{
    name: 'Id',
    type: 'int'
  }, {
    name: 'RoundItemId',
    type: 'int'
  }, {
    name: 'UniqueId',
    type: 'int'
  }, {
    name: 'Answer',
    type: 'string'
  }, {
    name: 'UploadId',
    type: 'int'
  }, {
    name: 'IsCorrect',
    type: 'boolean'
  }],

  proxy: {
    type: 'memory'
  }
});