const express = require('express');
const router = express.Router();
const db = require('../models/index');

module.exports = (io) => {
  const BaseCrudController = require('./BaseCrud')(db.User, io);
  router.get('/users', BaseCrudController.getAll);
  router.post('/users', BaseCrudController.createRecord);
  router.get('/users/:id', BaseCrudController.getById);
  router.put('/users/:id', BaseCrudController.updateById);
  router.delete('/users/:id', BaseCrudController.deleteById);
  return router;
};