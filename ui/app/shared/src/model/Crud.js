Ext.define('JefBox.model.Crud', {
  extend: 'Ext.data.Model',

  idProperty: 'Id',
  identifier: 'negative',
  // These are the default fields that CRUD models should inherit, as they should be the same
  fields: [{
    name: 'Id',
    type: 'int'
  }, {
    name: 'CreateDate',
    type: 'date',
    dateFormat: 'c',
    persist: false
  }, {
    name: 'UpdateDate',
    type: 'date',
    dateFormat: 'c',
    persist: false
  }, {
    name: 'UpdatedById',
    type: 'int'
  }, {
    name: 'DeleteDate',
    type: 'date',
    dateFormat: 'c',
    allowNull: true
  }, {
    name: 'OwnerId',
    type: 'int'
  }, {
    name: 'isDeleted',
    type: 'boolean',
    persist: false,
    depends: ['DeleteDate'],
    convert: function(value, record) {
      return !Ext.isEmpty(record.get('DeleteDate'));
    }
  }, {
    name: 'CanEdit',
    type: 'boolean',
    persist: false,
    depends: ['OwnerId'],
    convert: function(value, record) {
      if (UserProfile) {
        value = UserProfile.get('IsAdmin') || record.get('OwnerId') === UserProfile.getId();
      }
      return value;
    }
  }, {
    name: 'updatedByDisplay',
    type: 'string',
    persist: false,
    depends: ['UpdatedById'],
    convert: function(value, record) {
      return JefBox.store.Users.getUserNameById(record.get('UpdatedById'));
    }
  }, {
    name: 'ownerDisplay',
    type: 'string',
    persist: false,
    depends: ['OwnerId'],
    convert: function(value, record) {
      return JefBox.store.Users.getUserNameById(record.get('OwnerId'));
    }
  }]
});