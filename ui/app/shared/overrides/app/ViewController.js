Ext.define('JefBox.overrides.app.ViewController', {
  override: 'Ext.app.ViewController',

  VIEW_RECORD_KEY: 'viewRecord',

  getViewRecord: function() {
    const viewModel = this.getViewModel();
    const viewRecord = viewModel && viewModel.get(this.VIEW_RECORD_KEY);
    if (!viewRecord) {
      this.logError('viewRecord is undefined');
    }
    return viewRecord;
  }
});