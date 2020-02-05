const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const db = require('../models/index');
const fs = require('fs');
const Model = db.Upload;
const basePath = '/uploads';
const baseIdPath = `${basePath}/:id`;

module.exports = (io) => {
  router.post(basePath, (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      const data = fs.readFileSync(files.uploadFile.path);
      const record = await Model.create({
        Data: data,
        MimeType: files.uploadFile.type,
        FileName: files.uploadFile.name,
        OwnerId: req.session.user.Id
      });
      io.emit('updatedUploads');
      res.send({success: true, UploadId: record.Id});
    });
  });

  router.delete(baseIdPath, async (req, res) => {
    await Model.destroy({
      where: {
        Id: req.params.id
      }
    });
    res.sendStatus(204);
  });

  router.get(basePath, async (req, res) => {
    const records = await Model.findAll({
      attributes: {
        exclude: ['Data']
      }
    });
    res.send(records);
  });

  router.get(baseIdPath, async (req, res) => {
    const record = await Model.findOne({
      where: {
        Id: req.params.id
      }
    });
    const img = Buffer.from(record.Data);
    if (req.query.base64) {
      record.Data = img.toString('base64');
      return res.send(record);
    }
    res.writeHead(200, {
      'Content-Type': record.MimeType,
      'Content-Length': img.length
    });
    res.end(img);
  });

  return router;
};
