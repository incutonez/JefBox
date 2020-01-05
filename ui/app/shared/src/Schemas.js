Ext.define('JefBox.Schemas', {
  singleton: true,
  alternateClassName: [
    'Schemas'
  ],

  load: function(callback) {
    let me = this;
    Ext.Ajax.request({
      method: 'GET',
      url: 'api/schemas',
      callback: function(options, successful, response) {
        const values = response.getResponseData();
        if (successful && values) {
          for (let key in values) {
            me[key] = values[key];
          }
        }
        if (Ext.isFunction(callback)) {
          callback(successful);
        }
      }
    });
  }
});