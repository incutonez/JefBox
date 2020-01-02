Ext.define('JefBox.Icons', {
  singleton: true,
  alternateClassName: [
    'Icons'
  ],

  CHECKMARK: 'x-fa fa-check',
  CROSS: 'x-fa fa-times',
  DELETE: 'x-fa fa-trash',
  EDIT: 'x-fa fa-edit',
  GAMES: 'x-fa fa-gamepad',
  INFO: 'x-fa fa-info',
  NEW: 'x-fa fa-plus-circle',
  REFRESH: 'x-fa fa-redo',
  REVERT: 'x-fa fa-history',
  SAVE: 'x-fa fa-save',
  SEARCH: 'x-fa fa-search',
  START_MENU: 'x-fa fa-monument',
  TEAMS: 'x-fa fa-sitemap',
  UPLOAD: 'x-fa fa-upload',
  USERS: 'x-fa fa-users',
  VIEW: 'x-fa fa-info-circle',

  getIconMarkup: function(config) {
    if (!config) {
      return;
    }
    return `<span class="${config.iconCls} ${config.colorCls}"</span>`;
  }
});