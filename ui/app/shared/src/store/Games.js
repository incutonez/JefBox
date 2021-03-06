Ext.define('JefBox.store.Games', {
  extend: 'Ext.data.Store',
  singleton: true,
  model: 'JefBox.model.BaseGame',

  getChainedStore: function(filters) {
    return Ext.create('Ext.data.ChainedStore', {
      source: this,
      filters: filters || []
    });
  }
});