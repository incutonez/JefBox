Ext.define('JefBox.overrides.Container', {
  override: 'Ext.Container',

  setLoading: function(message) {
    const maskConfig = message ? {
      xtype: 'loadmask'
    } : false;
    if (Ext.isString(message)) {
      maskConfig.message = message;
    }
    this.setMasked(maskConfig);
  }
});