/**
 * When embedding youtube videos, there needs to be a domain name... otherwise, Video Unavailable will occur...
 * apparently there's something with the Youtube API that detects if an IP is hitting it vs a domain name.
 * See also https://stackoverflow.com/a/56419165/1253609
 */
Ext.define('JefBox.YouTubeAudioButton', {
  extend: 'Ext.Container',
  alias: 'widget.youTubeAudioButton',

  referenceHolder: true,
  defaultListenerScope: true,
  layout: {
    type: 'vbox',
    align: 'left'
  },
  config: {
    videoId: null,
    isPlaying: false
  },
  items: [{
    xtype: 'button',
    reference: 'toggleButton',
    tooltip: 'Play',
    handler: 'onClickToggleButton'
  }],

  /**
   * @ticket https://support.sencha.com/#ticket-50021
   */
  template: [{
    tag: 'iframe',
    reference: 'iframe',
    cls: Styles.ELEMENT_HIDDEN
  }],

  updateVideoId: function(videoId) {
    let src = '';
    if (videoId) {
      let extraConfig = {
        enablejsapi: 1
      };
      if (Ext.isObject(videoId)) {
        const temp = videoId.videoId;
        delete videoId.videoId;
        Ext.Object.merge(extraConfig, videoId);
        videoId = temp;
      }
      extraConfig = Ext.Object.toQueryString(extraConfig);
      src = `https://www.youtube.com/embed/${videoId}?${extraConfig}`;
    }
    this.iframe.dom.src = src;
  },

  updateIsPlaying: function(isPlaying) {
    const iframeContainer = this.iframe.dom;
    const toggleButton = this.lookup('toggleButton');
    const contentWindow = iframeContainer && iframeContainer.contentWindow;
    if (toggleButton) {
      toggleButton.setIconCls(isPlaying ? Icons.PAUSE : Icons.PLAY);
      toggleButton.setTooltip(isPlaying ? 'Pause' : 'Play');
    }
    if (contentWindow) {
      contentWindow.postMessage(Ext.encode({
        event: 'command',
        func: isPlaying ? 'playVideo' : 'pauseVideo'
      }), '*');
    }
  },

  onClickToggleButton: function() {
    this.setIsPlaying(!this.getIsPlaying());
  }
});