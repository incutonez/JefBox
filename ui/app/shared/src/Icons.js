Ext.define('JefBox.Icons', {
  singleton: true,
  alternateClassName: [
    'Icons'
  ],

  ACTIONS: 'x-fa fa-tools',
  ARROW_LEFT: 'x-fa fa-arrow-left',
  ARROW_RIGHT: 'x-fa fa-arrow-right',
  CHECKMARK: 'x-fa fa-check',
  CHECKMARK_ROUND: 'x-far fa-check-circle',
  CHECKMARK_ROUND_SOLID: 'x-fas fa-check-circle',
  CONFIGURE: 'x-fa fa-cog',
  CONNECT: 'x-fa fa-plug',
  CROSS: 'x-fa fa-times',
  DELETE: 'x-fa fa-trash',
  EDIT: 'x-fa fa-edit',
  GAMES: 'x-fa fa-gamepad',
  INFO: 'x-fa fa-info',
  MENU: 'x-fa fa-bars',
  NEW: 'x-fa fa-plus-circle',
  PAINT: 'x-fa fa-paint-brush',
  PAUSE: 'x-fa fa-pause',
  REFRESH: 'x-fa fa-redo',
  REVERT: 'x-fa fa-history',
  SAVE: 'x-fa fa-save',
  SEARCH: 'x-fa fa-search',
  SIGN_IN: 'x-fa fa-sign-in-alt',
  SIGN_OUT: 'x-fa fa-sign-out-alt',
  START: 'x-fa fa-play',
  START_MENU: 'x-fa fa-monument',
  TEAMS: 'x-fa fa-sitemap',
  UPLOAD: 'x-fa fa-upload',
  USERS: 'x-fa fa-users',
  VIEW: 'x-fa fa-info-circle',

  getIconMarkup: function(config) {
    if (!config) {
      return;
    }
    const colorCls = config.colorCls || '';
    let tooltip = '';
    if (config.tooltip) {
      tooltip = `data-qtip="${config.tooltip}"`;
    }
    return `<span ${tooltip} class="${config.iconCls} ${colorCls}"</span>`;
  }
});