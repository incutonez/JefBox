Ext.define('JefBox.AssociationWriter', {
  extend: 'Ext.data.writer.Json',
  alias: 'writer.associationWriter',

  config: {
    transform: function(data, request) {
      const records = request.getRecords();
      const record = records && records[0];
      const associations = record && record.associations;
      const associationKeys = [];
      for (let key in associations) {
        const association = associations[key];
        if (association && association.transform !== false && (!association.instanceName || association.fromSingle)) {
          associationKeys.push({
            key: association.associationKey,
            id: association.cls.idProperty
          });
        }
      }
      for (let i = 0; i < associationKeys.length; i++) {
        const association = associationKeys[i];
        const item = data[association.key];
        if (item) {
          data[association.key] = item.map(function(a) {
            return a[association.id];
          });
        }
      }
      return data;
    }
  }
});