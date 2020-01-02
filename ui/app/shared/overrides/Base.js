Ext.define('JefBox.overrides.Base', {
  override: 'Ext.Base',

  logError: function(msg) {
    Ext.log({
      msg: msg,
      level: 'error',
      stack: true
    });
  },

  logWarning: function(msg) {
    Ext.log({
      msg: msg,
      level: 'warn',
      stack: true
    });
  },

  logInfo: function(msg) {
    Ext.log({
      msg: msg,
      level: 'log',
      stack: true
    });
  }
});