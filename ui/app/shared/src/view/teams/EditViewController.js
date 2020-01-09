Ext.define('JefBox.view.teams.EditViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.teamsEditView',

  // TODOJEF: Impl
  onClickCreateUser: function() {

  },

  // TODOJEF: Impl
  onClickDeleteUser: function() {

  },

  onClickCancel: function() {
    this.closeView();
  },

  onClickSave: function() {
    const me = this;
    const viewRecord = me.getViewRecord();
    if (viewRecord) {
      JefBox.store.Teams.add(viewRecord);
      JefBox.store.Teams.sync({
        callback: function(record, options, successful) {
          me.closeView();
        }
      });
    }
  },

  getViewRecord: function() {
    const viewModel = this.getViewModel();
    const viewRecord = viewModel && viewModel.get('viewRecord');
    if (!viewRecord) {
      console.error('viewRecord is undefined');
    }
    return viewRecord;
  }
});