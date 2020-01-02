Ext.define('JefBox.overrides.ExtDate', {
  override: 'Ext.Date'
});
(function() {
  Ext.Date.formatCodes.g = 'Ext.String.leftPad((m.getHours() % 12) ? m.getHours() % 12 : 12, 2, "<span style=\'visibility: hidden;\'>0</span>")';
})();