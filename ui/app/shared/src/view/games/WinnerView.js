Ext.define('JefBox.view.games.WinnerView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.gamesWinnerView',
  requires: [
    'JefBox.YouTubeAudioButton',
    'JefBox.Iframe'
  ],

  viewModel: {
    data: {
      url: null,
      playSong: false,
      winnerName: null
    }
  },

  title: 'WINNER',
  closable: true,
  height: '80%',
  width: '80%',
  centered: true,
  defaultListenerScope: true,
  layout: 'fit',
  /**
   * @prototype https://fiddle.sencha.com/#view/editor&fiddle/330k
   * @patch https://support.sencha.com/#ticket-50159
   */
  left: '10%',
  top: '10%',
  cls: Styles.INNER_ELEMENT_FULL,
  bodyPadding: 0,
  minimizable: false,
  listeners: {
    destroy: 'onDestroyView',
    load: {
      element: 'element',
      delegate: 'iframe.congrats-video',
      fn: 'onLoadCongratsVideo'
    }
  },
  items: [{
    xtype: 'youTubeAudioButton',
    hidden: true,
    videoId: {
      videoId: 'YA5QJ8wsDp0',
      startSeconds: 73
    },
    bind: {
      isPlaying: '{playSong}'
    }
  }, {
    xtype: 'iframe',
    cls: 'congrats-video',
    bind: {
      src: '{url}'
    }
  }],

  constructor: function(config) {
    config = config || {};
    config.showAnimation = {
      type: 'slide',
      duration: 5000,
      direction: 'bottom',
      listeners: {
        scope: this,
        animationend: 'onAnimationEnd'
      }
    };
    this.callParent([config]);
  },

  generateConfetti: function(x, y) {
    confetti({
      particleCount: 50,
      angle: Math.floor(Math.random() * 120),
      spread: Math.floor(Math.random() * 100),
      zIndex: 9999999,
      ticks: 300,
      colors: [Ext.randomHex(), Ext.randomHex(), Ext.randomHex()],
      origin: {
        x: x,
        y: y
      }
    });
  },

  toggleAnimation: function(destroy) {
    const me = this;
    let taskRunner = me.taskRunner;
    if (taskRunner || destroy) {
      if (taskRunner) {
        taskRunner.destroy();
      }
      me.taskRunner = null;
      return;
    }
    taskRunner = me.taskRunner = Ext.create('Ext.util.TaskRunner');
    taskRunner.start({
      interval: 100,
      run: function() {
        me.generateConfetti(Math.random(), Math.random());
      }
    });
  },

  onAnimationEnd: function() {
    const viewModel = this.getViewModel();
    viewModel.set({
      url: 'https://www.youtube.com/embed/1Bix44C1EzY?autoplay=1&loop=1&playlist=1Bix44C1EzY',
      playSong: true
    });
  },

  onLoadCongratsVideo: function(event, tag) {
    if (tag && tag.src) {
      const viewModel = this.getViewModel();
      const winnerName = viewModel && viewModel.get('winnerName');
      this.toggleAnimation();
      this.setTitle(`WINNER ${winnerName}!!!!!!!!!!!!!!!`);
    }
  },

  onDestroyView: function() {
    this.toggleAnimation(true);
  }
});