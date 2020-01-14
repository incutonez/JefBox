Ext.define('JefBox.overrides.dataview.List', {
  override: 'Ext.dataview.List',

  privates: {
    /**
     * @patch https://fiddle.sencha.com/#fiddle/32lt&view/editor
     */
    syncRowsToHeight: function() {
      if (!this.store) {
        return;
      }
      this.callParent(arguments);
    }
  }
});