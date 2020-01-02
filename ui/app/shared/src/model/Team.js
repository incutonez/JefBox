Ext.define('JefBox.model.Team', {
  extend: 'JefBox.model.Crud',
  requires: [
    'JefBox.AssociationWriter',
    'JefBox.model.User'
  ],

  fields: [{
    name: 'Name',
    type: 'string',
    validators: [{
      type: 'presence'
    }]
  }, {
    name: 'Color',
    type: 'string',
    validators: [{
      type: 'presence'
    }]
  }, {
    name: 'GameId',
    type: 'int',
    allowNull: true
  }],

  hasMany: [{
    model: 'JefBox.model.User',
    associationKey: 'Users',
    getterName: 'getUsersStore',
    role: 'Users'
  }],

  proxy: {
    type: 'rest',
    url: 'api/teams',
    writer: {
      type: 'associationWriter',
      writeAllFields: true,
      allDataOptions: {
        associated: true
      }
    }
  }
});