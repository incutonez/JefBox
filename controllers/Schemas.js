const express = require('express');
const router = express.Router();
const Schemas = require('../schemas/index');

router.get('/schemas', (req, res) => {
  res.send(Schemas);
});

module.exports = router;