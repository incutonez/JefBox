module.exports = (Model, io) => {
  const BaseCrudModel = require('../models/BaseCrud')(Model);
  return {
    getAll: async (req, res) => {
      let data = await BaseCrudModel.getAllRecords(req.session.user.Id);
      return res.send(data);
    },
    getById: async (req, res) => {
      let data = await BaseCrudModel.getRecordById(req.params.id, req.session.user.Id);
      if (data) {
        return res.send(data);
      }
      return res.sendStatus(404);
    },
    createRecord: async (req, res) => {
      req.body.UpdatedById = req.session.user.Id;
      req.body.OwnerId = req.session.user.Id;
      await BaseCrudModel.createRecord(req.body);
      if (io && Model.updateEvent) {
        io.emit(Model.updateEvent);
      }
      return res.sendStatus(204);
    },
    updateById: async (req, res) => {
      req.body.UpdatedById = req.session.user.Id;
      await BaseCrudModel.updateRecord(req.body);
      if (io && Model.updateEvent) {
        io.emit(Model.updateEvent);
      }
      return res.sendStatus(204);
    },
    deleteById: async (req, res) => {
      await BaseCrudModel.updateRecord({
        Id: req.body.Id,
        UpdatedById: req.session.user.Id,
        // TODOJEF: Should move this flag into the User's controller
        IsActive: false
      });
      await BaseCrudModel.deleteRecord(req.params.id);
      if (io && Model.updateEvent) {
        io.emit(Model.updateEvent);
      }
      return res.sendStatus(204);
    }
  };
};