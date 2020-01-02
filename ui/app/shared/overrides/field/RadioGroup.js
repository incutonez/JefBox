/**
 * @prototype https://fiddle.sencha.com/#view/editor&fiddle/32cs
 * The RadioGroup was added in 7.0 of modern, so there are some issues with it... like binding to the value and updating
 * its changed value isn't working.
 */
Ext.define('JefBox.overrides.field.RadioGroup', {
  override: 'Ext.field.RadioGroup',

  getValue: function() {
    let value = this.callParent(arguments);
    let bind = this.getBind();
    let bindValue = bind && bind.value;
    if (bindValue) {
      if (Ext.isEmpty(value) && !Ext.isEmpty(bindValue.getValue())) {
        value = bindValue.getValue();
      }
      bindValue.setValue(value);
    }
    return value;
  }
});