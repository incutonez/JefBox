Ext.define('JefBox.overrides.data.AbstractStore', {
  override: 'Ext.data.AbstractStore',

  /**
   * @param {Object} config
   * For the possible signature of this, see Model.getData
   * @return {Object[]}
   * Returns the model data as objects
   */
  getRequestData: function(config) {
    const data = [];
    config = config || {};
    this.queryBy(function(record) {
      data.push(record.getData(config));
    });
    return data;
  }
});