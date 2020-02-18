Ext.define('Shared.overrides.util.Format', {
  override: 'Ext.util.Format',

  dateMonthDayYearHourMinuteSecond: function(value) {
    if (!Ext.isDate(value)) {
      value = new Date(value);
    }
    if (value.isValid()) {
      return Ext.Date.format(value, 'm/d/Y g:m:s A');
    }
  },

  storeToList: function(config) {
    config = config || {};
    const list = [];
    const store = config.store;
    const fields = config.fields;
    const tag = config.newLine ? 'div' : 'span';
    const comma = config.newLine ? '' : ', ';
    if (store) {
      store.each(function(record) {
        let item = null;
        if (Ext.isArray(fields)) {
          const items = [];
          for (let i = 0; i < fields.length; i++) {
            items.push(record.get(fields[i]));
          }
          item = items.join(', ');
        }
        else {
          item = record.get(fields);
        }
        list.push(item);
      });
    }
    return `<${tag}>` + list.join(`</${tag}>${comma}<${tag}>`) + `</${tag}>`;
  },

  integer: function(value) {
    return Ext.util.Format.number(value, '0,000');
  },

  decimal: function(value) {
    return Ext.util.Format.number(value, '0,000.00');
  },

  numberWithTwoDecimals: function(value) {
    // No decimals, so return as integer
    if (value % 1 === 0) {
      return Ext.util.Format.integer(value);
    }
    return Ext.util.Format.decimal(value);
  },

  minutesSeconds: function(timeInSeconds) {
    let display = '';
    if (Ext.isEmpty(timeInSeconds)) {
      return display;
    }
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    if (minutes) {
      display += this.plural(minutes, 'min') + ' ';
    }
    if (seconds) {
      display += this.plural(seconds, 'sec');
    }
    return display;
  }
});