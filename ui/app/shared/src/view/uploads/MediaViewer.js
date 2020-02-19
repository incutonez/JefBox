Ext.define('JefBox.view.uploads.MediaViewer', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.uploadsMediaViewer',

  viewModel: {
    data: {
      uploadId: null,
      imageUrl: null,
      videoId: null
    },

    formulas: {
      mediaMarkup: function(get) {
        const uploadId = get('uploadId');
        const imageUrl = get('imageUrl');
        const videoId = get('videoId');
        if (uploadId) {
          return `<img class="${Styles.MEDIA_TAG}" src="api/uploads/${uploadId}" />`;
        }
        else if (videoId) {
          return `<iframe class="${Styles.MEDIA_TAG}" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1" />`;
        }
        else if (imageUrl) {
          return `<img class="${Styles.MEDIA_TAG}" src="${imageUrl}" />`;
        }
      }
    }
  },

  height: '75%',
  minWidth: 0,
  bodyPadding: 0,
  layout: 'auto',
  cls: Styles.INNER_ELEMENT_FULL,
  bind: {
    html: '{mediaMarkup}'
  }
});