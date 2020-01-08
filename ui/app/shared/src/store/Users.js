Ext.define('JefBox.store.Users', {
  extend: 'Ext.data.Store',
  singleton: true,
  model: 'JefBox.model.User',

  listeners: {
    load: function() {
      // Whenever the store loads, let's make sure the UserProfile is using the latest bits
      let updatedProfile = this.findRecord('Id', UserProfile.getId(), 0, false, true, true);
      if (updatedProfile) {
        window.UserProfile = updatedProfile;
      }
    }
  },

  getUserNameById: function(id) {
    const record = this.findRecord('Id', id, 0, false, true, true);
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