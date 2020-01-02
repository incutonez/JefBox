Ext.define('JefBox.view.games.MainViewController', {
  extend: 'JefBox.view.BaseCrudViewController',
  alias: 'controller.gamesMainView',
  requires: [
    'JefBox.view.games.EditView'
  ],

  BASE_ROUTE: Routes.GAMES,
  EDIT_VIEW: 'JefBox.view.games.EditView'
});