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
          return `<img class="jefbox-media-tag" src="api/uploads/${uploadId}" />`;
        }
        else if (videoId) {
          return `<iframe style="height: 100%; max-width: 100%;" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1" />`;
        }
        else if (imageUrl) {
          return `<img class="jefbox-media-tag" src="${imageUrl}" />`;
        }
      }
    }
  },

  width: '50%',
  height: 'auto',
  minWidth: 0,
  bodyPadding: 0,
  layout: 'auto',
  cls: 'jefbox-media-viewer',
  bind: {
    html: '{mediaMarkup}'
  }
});