const express = require('express');
const router = express.Router();
const db = require('../models/index');

module.exports = (io) => {
  const BaseCrudController = require('./BaseCrud')(db.Team, io);
  router.get('/teams', BaseCrudController.getAll);
  router.post('/teams', BaseCrudController.createRecord);
  router.get('/teams/:id', BaseCrudController.getById);
  router.put('/teams/:id', BaseCrudController.updateById);
  router.delete('/teams/:id', BaseCrudController.deleteById);
  return router;
};
