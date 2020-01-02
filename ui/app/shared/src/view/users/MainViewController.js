Ext.define('JefBox.view.users.MainViewController', {
  extend: 'JefBox.view.BaseCrudViewController',
  alias: 'controller.usersView',
  requires: [
    'JefBox.view.users.EditView'
  ],

  BASE_ROUTE: Routes.USERS,
  EDIT_VIEW: 'JefBox.view.users.EditView'
});