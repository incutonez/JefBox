Ext.define('JefBox.store.Teams', {
  extend: 'Ext.data.Store',
  singleton: true,
  model: 'JefBox.model.Team',

  getTeamNameById: function(id) {
    const record = this.findRecord('Id', id, 0, false, true, true);
    return record && record.get('Name');
  },

  getChainedStore: function(filters) {
    return Ext.create('Ext.data.ChainedStore', {
      source: this,
      filters: filters || []
    });
  }
});