Ext.define('JefBox.EnumComboBox', {
  extend: 'Ext.field.ComboBox',
  alias: 'widget.enumComboBox',

  queryMode: 'local',
  valueField: 'Value',
  displayField: 'Description',
  forceSelection: true,
  required: true
});