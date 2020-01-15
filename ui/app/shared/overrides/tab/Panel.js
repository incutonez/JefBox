Ext.define('Shared.overrides.tab.Panel', {
  override: 'Ext.tab.Panel',

  /**
   * @patch https://fiddle.sencha.com/#view/editor&fiddle/327c
   */
  config: {
    layout: {
      type: 'card',
      animation: null
    }
  },

  constructor: function(config) {
    const me = this;
    me.callParent(arguments);
    me.on('activeItemchange', function(parent, child) {
      const grids = child && child.query('grid');
      if (grids) {
        for (let i = 0; i < grids.length; i++) {
          if (grids[i].isVisible()) {
            grids[i].forceRefresh();
          }
        }
      }
    });
  }
});