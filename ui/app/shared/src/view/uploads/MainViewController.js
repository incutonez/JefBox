Ext.define('JefBox.view.uploads.MainViewController', {
  extend: 'JefBox.view.BaseCrudViewController',
  alias: 'controller.uploadsMainView',
  requires: [
    'JefBox.view.uploads.EditView',
    'JefBox.view.uploads.ReadView'
  ],

  EDIT_VIEW: 'JefBox.view.uploads.EditView',

  onClickViewRecord: function(grid, info) {
    Ext.create('JefBox.view.uploads.ReadView', {
      viewModel: {
        data: {
          viewRecord: info.record
        }
      }
    });
  }
});