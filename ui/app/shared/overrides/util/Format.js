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
    let list = [];
    let store = config.store;
    let fields = config.fields;
    const tag = config.newLine ? 'div' : 'span';
    const comma = config.newLine ? '' : ', ';
    if (store) {
      store.each(function(record) {
        let item = null;
        if (Ext.isArray(fields)) {
          let items = [];
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
  }
});