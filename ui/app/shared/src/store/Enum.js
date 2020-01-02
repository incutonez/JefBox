Ext.define('JefBox.store.Enum', {
  extend: 'Ext.data.Store',
  alias: 'store.enum',
  model: 'JefBox.model.KeyValue',

  getDisplayValue: function(value) {
    const record = this.getEnumByValue(value);
    return record && record.get('Description');
  },

  getEnumByValue: function(value) {
    return this.findRecord('Value', value, 0, false, true, true);
  },

  getChainedStore: function(filters) {
    return Ext.create('Ext.data.ChainedStore', {
      source: this,
      filters: filters || []
    });
  }
});