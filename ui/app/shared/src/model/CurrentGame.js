Ext.define('JefBox.model.CurrentGame', {
  extend: 'JefBox.model.BaseGame',

  fields: [{
    name: 'GroupId',
    type: 'int'
  }, {
    name: 'GroupName',
    type: 'string'
  }]
});