/**
 * @prototype https://fiddle.sencha.com/#view/editor&fiddle/32d1
 */
Ext.define('JefBox.Painter', {
  extend: 'Ext.Component',
  alias: 'widget.painter',

  config: {
    strokeStyle: '#000000',
    lineWidth: 3,
    lineJoin: 'round',
    lineCap: 'round',
    context: null,
    memoryCanvas: null,
    memoryContext: null
  },

  defaultListenerScope: true,
  element: {
    reference: 'element',
    tag: 'canvas',
    listeners: {
      painted: 'onPaintCanvas',
      touchstart: 'onTouchStartCanvas',
      drag: 'onDragCanvas'
    }
  },

  initialize: function() {
    let memoryCanvas = document.createElement('canvas');
    // In memory canvas idea taken from https://stackoverflow.com/questions/11179274/html-canvas-drawing-disappear-on-resizing
    this.setMemoryCanvas(memoryCanvas);
    this.setMemoryContext(memoryCanvas.getContext('2d'));
    this.callParent();
  },

  resize: function() {
    let me = this;
    const parent = me.parent;
    const parentEl = parent && parent.el;
    let canvas = me.getCanvas();
    let memoryCanvas = me.getMemoryCanvas();
    let memoryContext = me.getMemoryContext();
    if (parentEl && canvas && memoryCanvas && memoryContext) {
      const parentWidth = parentEl.getWidth();
      const parentHeight = parentEl.getHeight();
      memoryCanvas.width = parentWidth;
      memoryCanvas.height = parentHeight;
      memoryContext.drawImage(canvas, 0, 0);
      canvas.width = parentWidth;
      canvas.height = parentHeight;
      let context = canvas.getContext('2d');
      context.drawImage(memoryCanvas, 0, 0);
      me.setContext(context);
    }
  },

  onPaintCanvas: function() {
    let parent = this.parent;
    if (parent) {
      parent.on('resize', 'onResizeParent', this);
      this.resize();
    }
  },

  onTouchStartCanvas: function(event) {
    let me = this;
    let context = me.getContext();
    const coords = me.getMouseCoords(event);
    if (context && coords) {
      context.lineWidth = me.getLineWidth();
      context.lineJoin = me.getLineJoin();
      context.lineCap = me.getLineCap();
      context.strokeStyle = me.getStrokeStyle();
      context.moveTo(coords.x, coords.y);
      context.beginPath();
    }
  },

  onDragCanvas: function(event) {
    let context = this.getContext();
    const coords = this.getMouseCoords(event);
    if (context && coords) {
      context.lineTo(coords.x, coords.y);
      context.stroke();
    }
  },

  onResizeParent: function() {
    this.resize();
  },

  getMouseCoords: function(event) {
    const canvas = this.getCanvas();
    const rect = canvas && canvas.getBoundingClientRect();
    if (rect) {
      const xy = event.getXY();
      return {
        // Need to adjust for scaling at the end in case widths and heights aren't the same
        x: (xy[0] - rect.left) * canvas.width / rect.width,
        y: (xy[1] - rect.top) * canvas.height / rect.height
      };
    }
  },

  getCanvas: function() {
    return this.el.dom;
  },

  getValue: function() {
    return this.el.dom.toDataURL();
  },

  saveImage: function() {
    this.el.dom.toBlob(function(blob) {
      let formData = new FormData();
      // TODOJEF: This works, but it'd be nice to do it with Ext.Ajax.request somehow
      let xhr = new XMLHttpRequest();
      formData.append('uploadFile', blob, 'mySave.png');
      xhr.open('POST', 'api/upload', true);
      xhr.send(formData);
    });
  }
});