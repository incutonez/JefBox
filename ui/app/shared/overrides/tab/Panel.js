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
  }
});