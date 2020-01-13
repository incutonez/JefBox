/**
 * When embedding youtube videos, there needs to be a domain name... otherwise, Video Unavailable will occur...
 * apparently there's something with the Youtube API that detects if an IP is hitting it vs a domain name.
 * See also https://stackoverflow.com/a/56419165/1253609
 */
Ext.define('JefBox.YoutubeVideo', {
  extend: 'Ext.Component',
  alias: 'widget.youtubeVideo',

  layout: {
    type: 'vbox'
  },
  element: {
    reference: 'element',
    children: [{
      reference: 'container',
      style: 'position: absolute; overflow: hidden;',
      children: [{
        reference: 'iframe',
        style: 'height: 300px; width: 70px; position: relative; top: -270px; frameborder="0";'
      }]
    }]
  },
  config: {
    videoId: null,
    player: null
  },

  updateVideoId: function(videoId) {
    if (videoId) {
      this.setPlayer(new YT.Player(this.iframe.getId(), {
        videoId: videoId,
        events: {
          onReady: function(event) {
            const player = event.target;
            player.playVideo();
            player.pauseVideo();
          }
        }
      }));
    }
  }
});