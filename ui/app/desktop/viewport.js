Ext.require('JefBox.view.main.MainView', function() {
  Ext.get('splash').destroy();
  // Because of the events of all of the different script loadings, we need to give some breathing room for the
  // Viewport to be created in the onLoad of app.js
  Ext.asap(function() {
    Ext.Viewport.add([{
      xtype: 'mainView'
    }]);
  });
});