const basePath = process.env.BASE_API_PATH + '/games';
const idPath = basePath + '/:id';
const idPathUI = basePath + '/:{Id:num}';
module.exports = {
  BASE_PATH: basePath,
  ID_PATH: idPath,
  ID_PATH_UI: idPathUI,
  JOIN_PATH: idPath + '/join',
  JOIN_PATH_UI: idPathUI + '/join'
};
