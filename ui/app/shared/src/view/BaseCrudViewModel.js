Ext.define('JefBox.view.BaseCrudViewModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.baseCrudView',

  data: {
    entityName: null,
    mainStoreModel: null
  },

  formulas: {
    viewTitle: function(get) {
      return get('entityName') + 's';
    }
  },

  stores: {
    mainStore: {
      model: '{mainStoreModel}'
    }
  }
});