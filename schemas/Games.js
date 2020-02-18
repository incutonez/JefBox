/* TODOJEF: Need to revisit this... there's a lot of dupe logic, and I need to remove adding the API to some of the UI
 * paths... it's also like I have 2 different UI schemas... one for routing, and the other for API calls/models */
const baseUrl = 'games';
const basePath = `${process.env.BASE_API_PATH}/${baseUrl}`;
const idPath = `${basePath}/:id`;
const idPathUI = `${basePath}/:{Id:num}`;
module.exports = {
  BASE_PATH: basePath,
  /* The ellipsis indicates that we can match anything... this is useful for deep linking but wanting to open the
   * parent view, which figures out what to do with the deep link */
  BASE_PATH_UI: `${baseUrl}(/:{Anything...})`,
  BASE_PATH_ID_UI: `${baseUrl}/:{Id:num}`,
  ID_PATH: idPath,
  ID_PATH_UI: idPathUI,
  JOIN_PATH: `${idPath}/join`,
  JOIN_PATH_UI: `${idPathUI}/join`,
  CONNECT_PATH_UI: `${baseUrl}/:{Id:num}/connect`,
  CURRENT_QUESTION: `${idPath}/currentRound`,
  ADD_ANSWER_PATH: `${idPath}/answers`,
  ADD_ANSWER_PATH_UI: `${idPathUI}/answers`,
  ANSWERS_ID: `${idPath}/answers/:AnswerId`,
  ANSWERS_ID_UI: `${idPathUI}/answers/:{AnswerId:num}`,
  UPDATE_ROUND_ITEM_PATH: `${idPath}/roundItems/:roundItemId`,
  ROUND_ITEM_ANSWERS: `${idPath}/roundItems/:roundItemId/answers`,
  UPDATE_ROUND_ITEM_PATH_UI: `${idPathUI}/roundItems/:{RoundItemId:num}`,
  ROUND_ITEM_ANSWERS_UI: `${idPathUI}/roundItems/:{RoundItemId:num}/answers`,
  ADD_WINNER_PATH: `${idPath}/winner`,
  ADD_WINNER_PATH_UI: `${idPathUI}/winner`,
  PLAYER_DETAILS: `${idPath}/player`,
  GROUP: `${idPath}/groups/:GroupId`,
  GROUP_UI: `${idPathUI}/groups/:{GroupId:num}`,
  SCORE: `${idPath}/score`,
  SCORE_UI: `${idPathUI}/score`,
  SOCKET_UPDATE: 'updatedGames',
  SOCKET_UPDATE_GROUP: 'updatedGamesGroup',
  SOCKET_UPDATE_ROUND: 'updatedGamesRound',
  SOCKET_UPDATE_ROUND_ANSWERS: 'updatedGamesRoundAnswers'
};
