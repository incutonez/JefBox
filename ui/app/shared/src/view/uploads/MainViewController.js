Ext.define('JefBox.view.uploads.MainViewController', {
  extend: 'JefBox.view.BaseCrudViewController',
  alias: 'controller.uploadsMainView',
  requires: [
    'JefBox.view.uploads.EditView',
    'JefBox.view.uploads.MediaViewer'
  ],

  EDIT_VIEW: 'JefBox.view.uploads.EditView',

  onClickViewRecord: function(grid, info) {
    Ext.create('JefBox.view.uploads.MediaViewer', {
      viewModel: {
        data: {
          uploadId: info.record.getId()
        }
      }
    });
  }
});