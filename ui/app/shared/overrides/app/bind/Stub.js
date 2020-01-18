Ext.define('JefBox.overrides.app.bind.Stub', {
  override: 'Ext.app.bind.Stub',
  privates: {
    bindMappings: {
      store: {
        count: 'getCount',
        first: 'first',
        last: 'last',
        loading: 'hasPendingLoad',
        totalCount: 'getTotalCount'
      },
      model: {
        dirty: 'isDirty',
        phantom: 'isPhantom',
        valid: 'isValid',
        // TODOJEF: This doesn't work... pick up on this https://fiddle.sencha.com/#view/editor&fiddle/2tb2
        loading: 'isLoading'
      }
    }
  }
});