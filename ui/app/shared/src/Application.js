Ext.define('JefBox.shared.Application', {
  extend: 'Ext.app.Application',
  name: 'JefBox',
  requires: [
    'Ext.*',
    'Ext.Loader',
    'JefBox.Enums',
    'JefBox.Schemas',
    'JefBox.model.User',
    'JefBox.Routes',
    'JefBox.Icons',
    'JefBox.Styles'
  ],

  viewport: {
    layout: 'fit'
  },

  viewModel: {},

  defaultToken: Routes.HOME,

  onAppUpdate: function() {
    Ext.Msg.confirm('Application Update', 'This application has an update, reload?', function(choice) {
      if (choice === 'yes') {
        window.location.reload();
      }
    });
  }
});
