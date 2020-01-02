Ext.define('JefBox.view.teams.MainViewController', {
  extend: 'JefBox.view.BaseCrudViewController',
  alias: 'controller.teamsMainView',
  requires: [
    'JefBox.view.teams.EditView'
  ],

  BASE_ROUTE: Routes.TEAMS,
  EDIT_VIEW: 'JefBox.view.teams.EditView'
});