Ext.define('JefBox.Iframe', {
  extend: 'Ext.Component',
  alias: 'widget.iframe',

  width: '100%',
  height: '100%',
  element: {
    reference: 'element',
    tag: 'iframe',
    cls: Styles.MEDIA_TAG
  },

  config: {
    src: null
  },

  updateSrc: function(src) {
    this.element.dom.src = src;
  }
});