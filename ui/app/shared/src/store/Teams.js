Ext.define('JefBox.store.Teams', {
  extend: 'Ext.data.Store',
  singleton: true,
  model: 'JefBox.model.Team',

  getChainedStore: function(filters) {
    return Ext.create('Ext.data.ChainedStore', {
      source: this,
      filters: filters || []
    });
  }
});