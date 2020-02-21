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
    isPlaying: false,
    player: null
  },
  items: [{
    xtype: 'button',
    reference: 'toggleButton',
    tooltip: 'Play',
    handler: 'onClickToggleButton'
  }, {
    xtype: 'component',
    reference: 'iframeContainer',
    cls: Styles.ELEMENT_HIDDEN
  }],

  updateVideoId: function(videoId) {
    const player = this.getPlayer();
    if (videoId && player) {
      player.cueVideoById(videoId);
    }
  },

  updateIsPlaying: function(isPlaying) {
    const toggleButton = this.lookup('toggleButton');
    const player = this.getPlayer();
    if (player) {
      if (isPlaying) {
        player.playVideo();
      }
      else {
        player.pauseVideo();
      }
    }
    if (toggleButton) {
      toggleButton.setIconCls(isPlaying ? Icons.PAUSE : Icons.PLAY);
      toggleButton.setTooltip(isPlaying ? 'Pause' : 'Play');
    }
  },

  initialize: function() {
    const me = this;
    me.callParent();
    Ext.asap(function() {
      const playerVars = me.getVideoId();
      new YT.Player(me.lookup('iframeContainer').getId(), {
        height: 0,
        width: 0,
        events: {
          onReady: function(event) {
            const playerVars = me.getVideoId();
            me.setPlayer(event.target);
            event.target.cueVideoById(playerVars);
            if (me.getIsPlaying()) {
              event.target.playVideo();
            }
          },
          onStateChange: function(event) {
            const playerVars = me.getVideoId();
            // We have to listen for when the video ends, so we can reset it to the proper start/end times
            if (event.data === YT.PlayerState.ENDED) {
              me.setIsPlaying(false);
              event.target.cueVideoById(playerVars);
            }
          }
        }
      });
    });
  },

  onClickToggleButton: function() {
    this.setIsPlaying(!this.getIsPlaying());
  }
});