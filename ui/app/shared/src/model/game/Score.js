Ext.define('JefBox.model.game.Score', {
  extend: 'Ext.data.Model',

  idProperty: 'Id',
  fields: [{
    name: 'Id',
    type: 'int'
  }, {
    name: 'GameId',
    type: 'int'
  }, {
    name: 'RoundItemId',
    type: 'int'
  }, {
    name: 'QuestionNumber',
    type: 'int'
  }, {
    name: 'UniqueId',
    type: 'int'
  }],

  proxy: {
    type: 'memory'
  }
});