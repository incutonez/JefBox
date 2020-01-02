Ext.require('JefBox.view.main.MainView', function() {
  Ext.get('splash').destroy();
  Ext.asap(function() {
    Ext.Viewport.add([{
      xtype: 'mainView'
    }]);
  });
});