Ext.define('JefBox.overrides.event.Event', {
  override: 'Ext.event.Event',

  isEnterKey: function() {
    return this.getKey() === this.ENTER;
  }
});