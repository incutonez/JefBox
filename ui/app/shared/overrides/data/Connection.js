Ext.define('Shared.shared.overrides.data.Connection', {
  override: 'Ext.data.Connection',

  constructor: function(config) {
    this.callParent(arguments);
    this.on({
      requestexception: function(conn, response, options, eOpts) {
        if (response.status === 401 && !Ext.checkingInitialAuth) {
          JefBox.model.User.showLogInView({
            token: Ext.util.History.getToken()
          });
        }
      }
    });
  }
});