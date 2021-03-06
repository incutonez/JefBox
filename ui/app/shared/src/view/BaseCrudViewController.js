Ext.define('JefBox.view.BaseCrudViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.baseCrudView',

  EDIT_VIEW: null,

  showEditDialog: function(record) {
    if (this.EDIT_VIEW) {
      Ext.create(this.EDIT_VIEW, {
        viewModel: {
          data: {
            viewRecord: record
          }
        }
      });
    }
  },

  onClickCreateRecordBtn: function() {
    const mainStore = this.getMainStore();
    const mainModel = mainStore && mainStore.getModel();
    if (mainModel) {
      this.showEditDialog(mainModel.loadData());
    }
  },

  onClickEditRecord: function(grid, info) {
    this.showEditDialog(info.record);
  },

  refreshMainStore: function() {
    const viewModel = this.getViewModel();
    if (viewModel) {
      viewModel.notify();
    }
    const mainStore = this.getMainStore();
    if (mainStore) {
      mainStore.load();
    }
  },

  onClickRefreshBtn: function() {
    this.refreshMainStore();
  },

  onBeforeEditRow: function(gridEditor, context) {
    return context.record.get('CanEdit');
  },

  onEditRow: function(gridEditor, context) {
    const me = this;
    me.savingRecord = true;
    context.record.save({
      callback: function(record, operation, successful) {
        me.savingRecord = false;
        me.refreshMainStore();
      }
    });
  },

  onClickDeleteRecord: function(grid, info) {
    info.record.erase({
      callback: function(record, operation, successful) {
        const response = operation.getResponse();
        const toastMsg = response && response.getToastMsg();
        if (toastMsg) {
          Ext.toast(toastMsg);
        }
      }
    });
  },

  // TODOJEF: Impl
  onClickViewRecord: Ext.emptyFn,

  onClickRevertRecord: function(grid, info) {
    const record = info.record;
    // Reverting
    if (record.get('isDeleted')) {
      record.set('DeleteDate', null);
      record.save({
        callback: function(record, operation, succcessful) {
          const response = operation.getResponse();
          const toastMsg = response && response.getToastMsg({
            actionType: 'revert'
          });
          if (toastMsg) {
            Ext.toast(toastMsg);
          }
        }
      });
    }
  },

  onCancelEditRow: function(sender, location) {
    const record = location.record;
    if (!this.savingRecord && record.phantom) {
      record.store.remove(record);
    }
  },

  getMainStore: function() {
    const mainStore = this.getStore('mainStore');
    if (!mainStore) {
      this.logError('mainStore is undefined');
    }
    return mainStore;
  }
});