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
  bodyPadding: 10,
  referenceHolder: true,
  maximizeAnimation: null,
  restoreAnimation: null,
  config: {
    canResize: true,
    autoShow: true,
    minimizable: true,
    isCrudDialog: false
  },

  resizeToScreen: function() {
    let hasChange = false;
    const body = Ext.getBody();
    const screenHeight = body.getHeight();
    const screenWidth = body.getWidth();
    const dialogHeight = this.getHeight();
    const dialogWidth = this.getWidth();
    if (dialogHeight > screenHeight + 20) {
      this.setHeight(screenHeight - 20);
      hasChange = true;
    }
    if (dialogWidth > screenWidth + 20) {
      this.setWidth(screenWidth - 20);
      hasChange = true;
    }
    if (hasChange) {
      this.center();
    }
  },

  onResizeDialog: function() {
    this.resizeToScreen();
  },

  onShowDialog: function() {
    this.resizeToScreen();
    this.center();
  },

  onRender: function() {
    this.callParent();
    const viewModel = this.getViewModel();
    if (viewModel) {
      viewModel.notify();
    }
  },

  updateCanResize: function(canResize) {
    const me = this;
    if (canResize) {
      me.setResizable({
        edges: 'all'
      });
      me.on({
        resize: 'onResizeDialog',
        show: 'onShowDialog',
        scope: me
      });
      Ext.getBody().on('resize', 'onResizeDialog', me);
    }
    else {
      me.setResizable(null);
      me.un({
        resize: 'onResizeDialog',
        show: 'onShowDialog',
        scope: me
      });
      Ext.getBody().un('resize', 'onResizeDialog', me);
    }
  },

  updateMinimizable: function(minimizable) {
    const me = this;
    if (minimizable) {
      me.addTool({
        type: 'minimize',
        scope: me,
        handler: 'onMinimizeDialog'
      });
    }
  },

  initialize: function(autoShow) {
    this.callParent();
    if (this.getAutoShow()) {
      this.show();
    }
  },

  updateIsCrudDialog: function(isCrudDialog) {
    if (isCrudDialog) {
      const bbar = this.getBbar();
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
      const viewRecord = this.getViewRecord(true);
      if (viewRecord) {
        viewRecord.reject();
      }
    }
  },

  /**
   * Override this if you'd like custom logic when the save button is clicked
   */
  onClickSaveBtn: function() {
    const me = this;
    const viewRecord = me.getViewRecord();
    if (viewRecord) {
      viewRecord.save({
        callback: function(record, operation, successful) {
          const response = operation.getResponse();
          const toastMsg = response && response.getToastMsg();
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

  getViewRecord: function(suppress) {
    const viewModel = this.getViewModel();
    const viewRecord = viewModel && viewModel.get('viewRecord');
    if (!suppress && !viewRecord) {
      this.logError('viewRecord is undefined');
    }
    return viewRecord;
  }
});