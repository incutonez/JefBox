Ext.define('JefBox.store.Users', {
  extend: 'Ext.data.Store',
  singleton: true,
  model: 'JefBox.model.User',

  getUserNameById: function(id) {
    let record = this.findRecord('Id', id, 0, false, true, true);
    return record && record.get('UserName');
  },

  getActiveUsersStore: function(extraFilters) {
    return Ext.create('Ext.data.ChainedStore', {
      source: this,
      filters: Ext.Array.merge([{
        property: 'isDeleted',
        value: false
      }], extraFilters || [])
    });
  }
});