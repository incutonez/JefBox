Ext.define('JefBox.AssociationWriter', {
  extend: 'Ext.data.writer.Json',
  alias: 'writer.associationWriter',

  config: {
    transform: function(data, request) {
      let records = request.getRecords();
      let record = records && records[0];
      let associations = record && record.associations;
      let associationKeys = [];
      for (let key in associations) {
        let association = associations[key];
        if (association && association.transform !== false && (!association.instanceName || association.fromSingle)) {
          associationKeys.push({
            key: association.associationKey,
            id: association.cls.idProperty
          });
        }
      }
      for (let i = 0; i < associationKeys.length; i++) {
        let association = associationKeys[i];
        let item = data[association.key];
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