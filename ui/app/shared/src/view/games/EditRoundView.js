Ext.define('JefBox.view.games.EditRoundView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.gamesEditRoundView',

  viewModel: {
    data: {
      saveBtnText: 'Update',
      groupName: null,
      groupIndex: null
    }
  },

  title: 'Edit Round',
  isCrudDialog: true,
  width: 200,
  height: 200,
  layout: {
    type: 'vbox'
  },
  items: [{
    xtype: 'textfield',
    label: 'Name',
    bind: {
      value: '{groupName}'
    }
  }, {
    xtype: 'numberfield',
    label: 'Index',
    bind: {
      value: '{groupIndex}'
    }
  }],

  onClickSaveBtn: function() {
    const viewModel = this.getViewModel();
    if (viewModel) {
      this.fireEvent('updateGroup', viewModel.get('groupName'), viewModel.get('groupIndex'));
    }
    this.close();
  }
});