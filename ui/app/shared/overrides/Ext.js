Ext.define('JefBox.overrides.Ext', {
  override: 'Ext',

  randomHex: function() {
    return '#' + (16777216 + Math.floor(Math.random() * 16777216)).toString(16).slice(-6);
  }
});