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
    var me = this;
    var viewRecord = me.getViewRecord();
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
    var viewModel = this.getViewModel();
    var viewRecord = viewModel && viewModel.get('viewRecord');
    if (!viewRecord) {
      console.error('viewRecord is undefined');
    }
    return viewRecord;
  }
});