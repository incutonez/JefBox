Ext.define('JefBox.model.game.RoundItemChoice', {
  extend: 'Ext.data.Model',

  idProperty: 'Id',
  identifier: 'negative',
  fields: [{
    name: 'Id',
    type: 'int'
  }, {
    name: 'Value',
    type: 'string',
    validators: [{
      type: 'presence'
    }]
  }, {
    name: 'Order',
    type: 'int'
  }, {
    name: 'RoundItemId',
    type: 'int',
    allowNull: true
  }, {
    name: 'IsAnswer',
    type: 'boolean'
  }],

  proxy: {
    type: 'memory'
  }
});