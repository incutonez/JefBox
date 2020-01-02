/**
 * @author Jef Harkay
 *
 * This gets populated in JefBox.store.EnumsLoader
 */
Ext.define('JefBox.Enums', {
  singleton: true,
  alternateClassName: [
    'Enums'
  ],
  requires: [
    'JefBox.store.Enum'
  ],

  loadEnums: function(callback) {
    let me = this;
    Ext.Ajax.request({
      method: 'GET',
      url: 'api/enums',
      callback: function(options, successful, response) {
        const enums = Ext.decode(response.responseText);
        if (successful && enums) {
          for (let i = 0; i < enums.length; i++) {
            const enumData = enums[i];
            let enumProperties = Ext.create('JefBox.store.Enum', {
              data: enumData.Values
            });
            enumProperties.each(function(enumProperty) {
              // Store the enum property name on the enum model itself
              enumProperties[enumProperty.getId()] = enumProperty.get('Value');
            });
            me[enumData.Name] = enumProperties;
          }
        }
        if (Ext.isFunction(callback)) {
          callback(successful);
        }
      }
    });
  }
});