Ext.define('JefBox.overrides.Date', {
  override: 'Date',
  /**
   * Checks to see if the passed Date value is a valid date
   * @param {Date} value
   * @return {Boolean}
   */
  isValid: function() {
    return !isNaN(this.getTime());
  }
});