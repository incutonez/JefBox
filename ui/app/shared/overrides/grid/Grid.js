Ext.define('Shared.shared.overrides.grid.Grid', {
  override: 'Ext.grid.Grid',

  config: {
    infinite: false
  },

  constructor: function(config) {
    const me = this;
    if (Ext.isEmpty(config.columnLines)) {
      config.columnLines = true;
    }
    me.callParent(arguments);
    me.on('activate', function() {
      me.forceRefresh();
    });
  },

  /**
   * @patch https://fiddle.sencha.com/#view/editor&fiddle/32mq
   * @patch https://fiddle.sencha.com/#view/editor&fiddle/32ls
   */
  forceRefresh: function() {
    if (this.rendered) {
      this.clearItems();
      this.refresh();
    }
  }
});