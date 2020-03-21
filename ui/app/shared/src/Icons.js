Ext.define('JefBox.Icons', {
  singleton: true,
  alternateClassName: [
    'Icons'
  ],

  ACTIONS: 'x-fa fa-tools',
  ADDRESS: 'x-fa fa-address-card',
  ANNOUNCE: 'x-fa fa-bullhorn',
  ARROW_LEFT: 'x-fa fa-arrow-left',
  ARROW_RIGHT: 'x-fa fa-arrow-right',
  CHECKMARK: 'x-fa fa-check',
  CHECKMARK_ROUND: 'x-far fa-check-circle',
  CHECKMARK_ROUND_SOLID: 'x-fas fa-check-circle',
  CLEAR: 'x-fa fa-eraser',
  CONFIGURE: 'x-fa fa-cog',
  CONNECT: 'x-fa fa-plug',
  CROSS: 'x-fa fa-times',
  DELETE: 'x-fa fa-trash',
  EDIT: 'x-fa fa-edit',
  GAMES: 'x-fa fa-gamepad',
  HIDE: 'x-fa fa-eye-slash',
  INFO: 'x-fa fa-info',
  MENU: 'x-fa fa-bars',
  NEW: 'x-fa fa-plus-circle',
  NUCLEAR: 'x-fa fa-radiation-alt jefbox-color-radiation',
  PAINT: 'x-fa fa-paint-brush',
  PAUSE: 'x-fa fa-pause',
  PLAY: 'x-fa fa-play',
  REFRESH: 'x-fa fa-redo',
  REVERT: 'x-fa fa-history',
  SAVE: 'x-fa fa-save',
  SEARCH: 'x-fa fa-search',
  SEND: 'x-fa fa-share',
  SHOW: 'x-fa fa-eye',
  SIGN_IN: 'x-fa fa-sign-in-alt',
  SIGN_OUT: 'x-fa fa-sign-out-alt',
  START: 'x-fa fa-play',
  START_MENU: 'x-fa fa-monument',
  SUBMIT: 'x-fa fa-clipboard-check',
  TEAMS: 'x-fa fa-sitemap',
  TIMER_END: 'x-fa fa-hourglass-end',
  TIMER_MIDDLE: 'x-fa fa-hourglass-half',
  TIMER_START: 'x-fa fa-hourglass-start',
  UNDO: 'x-fa fa-undo',
  UPLOAD: 'x-fa fa-upload',
  UPLOAD_FILE: 'x-fa fa-file-upload',
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