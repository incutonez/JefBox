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
        let videoId = get('videoId');
        if (uploadId) {
          return `<img class="${Styles.MEDIA_TAG}" src="api/uploads/${uploadId}" />`;
        }
        else if (videoId) {
          let extraParams = {
            enablejsapi: 1
          };
          if (Ext.isObject(videoId)) {
            const temp = videoId.videoId;
            delete videoId.videoId;
            Ext.Object.merge(extraParams, videoId);
            videoId = temp;
            extraParams = Ext.Object.toQueryString(extraParams);
          }
          // TODOJEF: Replace with YT player
          return `<iframe class="${Styles.MEDIA_TAG}" src="https://www.youtube.com/embed/${videoId}?${extraParams}" />`;
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