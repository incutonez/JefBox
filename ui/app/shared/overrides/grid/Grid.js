Ext.define('JefBox.overrides.grid.Grid', {
  override: 'Ext.grid.Grid',

  constructor: function(config) {
    const me = this;
    if (Ext.isEmpty(config.columnLines)) {
      config.columnLines = true;
    }
    config.titleBar = Ext.Object.merge({
      titleAlign: 'left'
    }, config.titleBar);
    me.callParent(arguments);
    me.on('activate', function() {
      me.forceRefresh();
    });
  },

  updateGrouped: function(grouped) {
    const clickConfig = {
      element: 'element',
      delegate: '.x-rowheader',
      scope: this,
      fn: 'onClickGroupHeader'
    };
    if (grouped) {
      this.on({
        click: clickConfig
      });
    }
    else {
      this.un({
        click: clickConfig
      });
    }
    this.callParent(arguments);
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
  },

  onClickGroupHeader: function(event, htmlEl) {
    const domEl = Ext.get(htmlEl);
    const cmp = domEl && domEl.component;
    const group = cmp && cmp.getGroup();
    if (group) {
      group.toggleCollapsed();
    }
  }
});