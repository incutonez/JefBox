Ext.define('JefBox.overrides.field.InputMask', {
  override: 'Ext.field.InputMask',

  cachedConfig: {
    characters: {
      'h': '[a-fA-F0-9]'
    }
  }
});