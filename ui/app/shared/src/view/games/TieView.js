Ext.define('JefBox.view.games.TieView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.gamesTieView',

  viewModel: {
    data: {
      winners: null,
      selectedGroup: null
    },

    formulas: {
      saveBtnDisabled: function(get) {
        return !get('selectedGroup');
      },
      winnersData: function(get) {
        const tiedGroups = get('winners');
        if (tiedGroups) {
          return tiedGroups.map(function(x) {
            return {
              GroupName: x.getGroupKey(),
              Group: x
            };
          });
        }
      }
    },

    stores: {
      winnersStore: {
        fields: ['GroupName', 'Group'],
        data: '{winnersData}'
      }
    }
  },

  title: 'Choose Winner',
  layout: 'fit',
  bodyPadding: 0,
  height: 200,
  width: 200,
  minimizable: false,
  maximizable: false,
  isCrudDialog: true,
  items: [{
    xtype: 'grid',
    bind: {
      store: '{winnersStore}',
      selection: '{selectedGroup}'
    },
    columns: [{
      text: 'Group',
      flex: 1,
      dataIndex: 'GroupName'
    }]
  }],

  onClickSaveBtn: function() {
    const viewModel = this.getViewModel();
    this.fireEvent('selectedWinner', viewModel && viewModel.get('selectedGroup.Group'));
    this.close();
  }
});