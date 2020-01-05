Ext.define('JefBox.model.Game', {
  extend: 'JefBox.model.Crud',
  requires: [
    'JefBox.AssociationWriter',
    'JefBox.model.Team',
    'JefBox.model.game.RoundItem'
  ],

  fields: [{
    name: 'Name',
    type: 'string',
    validators: [{
      type: 'presence'
    }]
  }, {
    name: 'Type',
    type: 'int',
    defaultValue: Enums.GameTypes.TRIVIA,
    validators: [{
      type: 'presence'
    }]
  }, {
    name: 'Room',
    type: 'string'
  }, {
    name: 'Status',
    type: 'int'
  }, {
    name: 'AllowTeams',
    type: 'boolean',
    defaultValue: true
  }],

  hasMany: [{
    model: 'JefBox.model.Team',
    associationKey: 'Teams',
    role: 'Teams',
    getterName: 'getTeamsStore'
  }, {
    model: 'JefBox.model.game.RoundItem',
    associationKey: 'RoundItems',
    role: 'RoundItems',
    getterName: 'getRoundItemsStore',
    transform: false,
    storeConfig: {
      remoteSort: false,
      remoteFilter: false,
      groupField: 'Round',
      sorters: [{
        property: 'Order',
        direction: 'ASC'
      }]
    }
  }],

  proxy: {
    type: 'rest',
    url: Schemas.Games.BASE_PATH,
    writer: {
      type: 'associationWriter',
      writeAllFields: true,
      allDataOptions: {
        associated: true,
        critical: true
      },
      partialDataOptions: {
        associated: true,
        critical: true
      }
    }
  }
});