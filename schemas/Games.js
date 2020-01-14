const baseUrl = 'games';
const basePath = `${process.env.BASE_API_PATH}/${baseUrl}`;
const idPath = `${basePath}/:id`;
const idPathUI = `${basePath}/:{Id:num}`;
module.exports = {
  BASE_PATH: basePath,
  /* The ellipsis indicates that we can match anything... this is useful for deep linking but wanting to open the
   * parent view, which figures out what to do with the deep link */
  BASE_PATH_UI: `${baseUrl}(/:{Anything:...})`,
  ID_PATH: idPath,
  ID_PATH_UI: idPathUI,
  JOIN_PATH: `${idPath}/join`,
  JOIN_PATH_UI: `${idPathUI}/join`,
  CONNECT_PATH_UI: `${baseUrl}(/:{Id:num}/connect)`,
  ADD_ANSWER_PATH: `${idPath}/answers`,
  ADD_ANSWER_PATH_UI: `${idPathUI}/answers`,
  UPDATE_ROUND_ITEM_PATH: `${idPath}/roundItems/:roundItemId`,
  UPDATE_ROUND_ITEM_PATH_UI: `${idPathUI}/roundItems/:{RoundItemId:num}`,
  ADD_WINNER_PATH: `${idPath}/winner`,
  ADD_WINNER_PATH_UI: `${idPathUI}/winner`
};
