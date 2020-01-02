const express = require('express');
const router = express.Router();
const db = require('../models/index');
const BASE_ROUTE = '/games';
const BASE_ID_ROUTE = BASE_ROUTE + '/:id';

module.exports = (io) => {
  const BaseCrudController = require('./BaseCrud')(db.Game, io);

  router.get(BASE_ROUTE, BaseCrudController.getAll);
  router.post(BASE_ROUTE, BaseCrudController.createRecord);
  router.get(BASE_ID_ROUTE, BaseCrudController.getById);
  router.put(BASE_ID_ROUTE, BaseCrudController.updateById);
  router.delete(BASE_ID_ROUTE, BaseCrudController.deleteById);
  return router;
};
