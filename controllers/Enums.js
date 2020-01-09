const express = require('express');
const router = express.Router();
const Enums = require('../enums/index');

router.get('/enums', (req, res) => {
  const enums = [];
  for (let enumType in Enums) {
    const value = Enums[enumType];
    const result = [];
    for (let key in value) {
      // Skip, as this is a reserved keyword
      if (key.endsWith('_DESCRIPTION')) {
        continue;
      }
      let description = value[key + '_DESCRIPTION'];
      if (!description) {
        description = key.split('_').map((item) => {
          return item[0] + item.slice(1).toLowerCase();
        }).join(' ');
      }
      result.push({
        Key: key,
        Value: value[key],
        Description: description
      });
    }
    enums.push({
      Name: enumType,
      Values: result
    });
  }
  res.send(enums);
});

module.exports = router;