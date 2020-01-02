Ext.define('JefBox.BaseDialog', {
  extend: 'Ext.Dialog',
  alias: 'widget.baseDialog',

  viewModel: {
    data: {
      cancelBtnText: 'Cancel',
      saveBtnText: 'Save',
      viewRecord: null
    },
    formulas: {
      saveBtnDisabled: function(get) {
        return false;
      }
    }
  },

  height: 500,
  width: 1000,
  layout: 'fit',
  maximizable: true,
  closable: true,
  bodyPadding: 0,
  config: {
    autoShow: true,
    minimizable: true,
    isCrudDialog: false
  },

  updateMinimizable: function(minimizable) {
    let me = this;
    if (minimizable) {
      me.addTool({
        type: 'minimize',
        scope: me,
        handler: 'onMinimizeDialog'
      });
    }
  },

  updateAutoShow: function(autoShow) {
    if (autoShow) {
      this.show();
    }
  },

  updateIsCrudDialog: function(isCrudDialog) {
    if (isCrudDialog) {
      let bbar = this.getBbar();
      const buttonConfig = [{
        xtype: 'button',
        handler: 'onClickSaveBtn',
        text: 'Save',
        align: 'right',
        scope: this,
        bind: {
          text: '{saveBtnText}',
          disabled: '{saveBtnDisabled}'
        }
      }, {
        xtype: 'button',
        align: 'right',
        text: 'Cancel',
        scope: this,
        handler: 'onClickCancelBtn',
        bind: {
          text: '{cancelBtnText}'
        }
      }];
      if (bbar) {
        bbar.add(buttonConfig);
      }
      // bbar hasn't been created, so let's do that here
      else {
        this.setBbar({
          layout: {
            pack: 'end'
          },
          items: buttonConfig
        });
      }
      this.on('close', this.onCloseDialog, this);
    }
  },

  onCloseDialog: function() {
    // If the close was invoked, and the user didn't click the save button, let's revert any changes
    if (!this.clickedSave) {
      let viewRecord = this.getViewRecord();
      if (viewRecord) {
        viewRecord.reject();
      }
    }
  },

  /**
   * Override this if you'd like custom logic when the save button is clicked
   */
  onClickSaveBtn: function() {
    let me = this;
    let viewRecord = me.getViewRecord();
    if (viewRecord) {
      viewRecord.save({
        callback: function(record, operation, successful) {
          let response = operation.getResponse();
          let toastMsg = response && response.getToastMsg();
          if (toastMsg) {
            Ext.toast(toastMsg);
          }
          if (successful) {
            me.clickedSave = true;
            me.close();
          }
        }
      });
    }
  },

  onCloseTool: function() {
    this.clickedX = true;
    this.callParent(arguments);
  },

  /**
   * Override this handler if you'd like to do something else with cancel
   */
  onClickCancelBtn: function() {
    this.clickedCancel = true;
    this.close();
  },

  onMinimizeDialog: function() {
    this.hide();
    this.fireEvent('minimize', this);
  },

  getViewRecord: function() {
    let viewModel = this.getViewModel();
    let viewRecord = viewModel && viewModel.get('viewRecord');
    if (!viewRecord) {
      this.logError('viewRecord is undefined');
    }
    return viewRecord;
  }
});