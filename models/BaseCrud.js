module.exports = (Model) => {
  const db = require('./index');

  /**
   * This method is for associations that do not need to be created... they get sent in as an array of IDs
   */
  async function updateLinkedAssociation(record, key, items) {
    await record['set' + key](items);
  }

  /**
   * This method is for associations that do need to be created... they get sent in as an array of objects
   */
  async function updateAssociation(record, associations, items) {
    if (associations) {
      for (let i = 0; i < associations.length; i++) {
        let ids = [];
        let association = associations[i];
        let existing = record && record[association.as];
        if (existing) {
          for (let j = 0; j < existing.length; j++) {
            await existing[j].destroy();
          }
        }
        for (let j = 0; j < items.length; j++) {
          let ass = await association.model.create(items[j]);
          await updateAssociations(ass, items[j], association.model);
          ids.push(ass[association.model.primaryKeyAttribute]);
        }
        await updateLinkedAssociation(record, association.as, ids);
      }
    }
  }

  /**
   * Generic method to determine which association method should be called
   */
  async function updateAssociations(record, data, model) {
    model = model || Model;
    for (let key in model.associations) {
      let items = data[key];
      // If the association exists in our create, let's do something about it
      if (items) {
        if (Array.isArray(items)) {
          // If we're sending in an array of objects, then we want to create this association and tie it to this record
          if (typeof items[0] === 'object') {
            await updateAssociation(record, model.updateInclude, items);
          }
          // Otherwise, the entities exist, and all we want to do is associate them
          else {
            await updateLinkedAssociation(record, key, items);
          }
        }
      }
    }
    return record;
  }

  async function getRecordById(id, userId) {
    let searchOptions = {
      paranoid: await db.User.excludeDeleted(userId),
      where: {
        Id: id
      }
    };
    if (Model.includeOptions) {
      searchOptions.include = Model.includeOptions;
    }
    return Model.findOne(searchOptions);
  }

  async function getAllRecords(userId) {
    let searchOptions = {
      paranoid: await db.User.excludeDeleted(userId)
    };
    if (Model.includeOptions) {
      searchOptions.include = Model.includeOptions;
    }
    return Model.findAll(searchOptions);
  }

  async function createRecord(data) {
    let record = await Model.create(data);
    record = await getRecordById(record.Id);
    return await updateAssociations(record, data);
  }

  async function updateRecord(data) {
    await Model.update(data, {
      paranoid: await db.User.excludeDeleted(data.UpdatedById),
      where: {
        Id: data.Id
      },
      include: Model.updateInclude
    });
    let record = await getRecordById(data.Id);
    return await updateAssociations(record, data);
  }

  async function deleteRecord(id) {
    return Model.destroy({
      where: {
        Id: id
      }
    });
  }

  return {
    getRecordById: getRecordById,
    getAllRecords: getAllRecords,
    createRecord: createRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord
  };
};