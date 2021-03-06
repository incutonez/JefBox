const db = require('../models/index');
const express = require('express');
const router = express.Router();

router.get('/logout', async (req, res) => {
  await req.session.destroy();
  res.sendStatus(403);
});

router.get('/login', async (req, res) => {
  const user = req.session.user;
  const record = user && await db.User.findOne({
    where: {
      UserName: db.User.getUserNameFind(user.UserName)
    },
    include: db.User.includeOptions
  });
  if (record) {
    req.session.user = record.get({
      plain: true
    });
    return res.send(record);
  }
  return res.sendStatus(401);
});

router.post('/login', async (req, res) => {
  const results = await db.User.findOrCreate({
    where: {
      UserName: db.User.getUserNameFind(req.body.UserName)
    },
    defaults: req.body,
    include: db.User.includeOptions
  });
  const record = results && results[0];
  if (record && record.isPassword(req.body.Password)) {
    req.session.user = record.get({
      plain: true
    });
    return res.send(record);
  }
  return res.sendStatus(401);
});

module.exports = router;