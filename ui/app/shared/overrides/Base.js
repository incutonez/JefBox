Ext.define('JefBox.overrides.Base', {
  override: 'Ext.Base',

  privates: {
    logMessage: function(message, level, showDialog) {
      Ext.log({
        msg: message,
        level: level,
        stack: true
      });
      if (showDialog) {
        Ext.create('Ext.MessageBox').show({
          title: Ext.String.capitalize(level),
          message: message
        });
      }
    }
  },

  logError: function(msg, showDialog) {
    this.logMessage(msg, 'error', showDialog);
  },

  logWarning: function(msg, showDialog) {
    this.logMessage(msg, 'warn', showDialog);
  },

  logInfo: function(msg, showDialog) {
    this.logMessage(msg, 'log', showDialog);
  }
});