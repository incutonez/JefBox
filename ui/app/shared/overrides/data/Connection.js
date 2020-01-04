Ext.define('Shared.shared.overrides.data.Connection', {
  override: 'Ext.data.Connection',

  constructor: function(config) {
    this.callParent(arguments);
    this.on({
      requestexception: function(conn, response, options, eOpts) {
        if ((response.status === 401 || response.status === 403) && !Ext.checkingInitialAuth) {
          JefBox.model.User.showLogInView({
            token: Ext.util.History.getToken()
          });
        }
      }
    });
  },

  request: function(options) {
    let me = this,
    requestOptions, request;

    options = options || {};

    if (options.formData) {
      /* This portion was copied from the Ext.data.Connection source class... the only change was that I added the
       * options.blob for the request.start param */
      if (me.fireEvent('beforerequest', me, options) !== false) {
        requestOptions = me.setOptions(options, options.scope || Ext.global);

        request = me.createRequest(options, requestOptions);

        return request.start(options.formData);
      }
    }
    return this.callParent(arguments);
  }
});