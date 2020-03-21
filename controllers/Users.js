const express = require('express');
const router = express.Router();
const db = require('../models/index');
const DNS = require('dns');
const HOST_NAME = require('os').hostname();

module.exports = (io) => {
  const BaseCrudController = require('./BaseCrud')(db.User, io);
  router.get('/users', BaseCrudController.getAll);
  router.post('/users', BaseCrudController.createRecord);
  router.get('/users/:id', BaseCrudController.getById);
  router.put('/users/:id', BaseCrudController.updateById);
  router.delete('/users/:id', BaseCrudController.deleteById);
  router.get('/ip', (req, res) => {
    DNS.lookup(HOST_NAME, function(err, add, fam) {
      return res.send({
        ip: add,
        port: parseInt(process.env.PORT, 10)
      });
    });
  });
  return router;
};