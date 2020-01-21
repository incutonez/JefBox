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
    points: [],
    fileName: UserProfile.get('UserName') + '_paint.png'
  },

  defaultListenerScope: true,
  element: {
    reference: 'element',
    tag: 'canvas',
    listeners: {
      painted: 'onPaintCanvas',
      touchstart: 'onTouchStartCanvas',
      touchend: 'onTouchEndCanvas',
      drag: 'onDragCanvas'
    }
  },

  redrawAll: function() {
    const context = this.getContext();
    const points = this.getPoints();
    this.clearImage(true);
    for (let i = 0; i < points.length; i++) {
      const pointSet = points[i];
      const coords = pointSet.points;
      if (context.lineWidth !== pointSet.size) {
        context.lineWidth = pointSet.size;
      }
      if (context.strokeStyle !== pointSet.color) {
        context.strokeStyle = pointSet.color;
      }
      for (let j = 0; j < coords.length; j++) {
        const pt = coords[j];
        if (j === 0) {
          context.moveTo(pt[0], pt[1]);
          context.beginPath();
        }
        else {
          context.lineTo(pt[0], pt[1]);
        }
        context.stroke();
      }
    }
  },

  clearImage: function(softDelete) {
    const context = this.getContext();
    const canvas = this.getCanvas();
    if (context && canvas) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (!softDelete) {
        this.setPoints([]);
      }
    }
  },

  undoLast: function() {
    this.getPoints().pop();
    this.redrawAll();
  },

  saveImage: function(cb) {
    const me = this;
    me.el.dom.toBlob(function(blob) {
      const formData = new FormData();
      formData.append('uploadFile', blob, me.getFileName());
      Ext.Ajax.request({
        type: 'ajax',
        url: 'api/uploads',
        method: 'POST',
        formData: formData,
        callback: function(options, successful, response) {
          if (Ext.isFunction(cb)) {
            cb(response, successful);
          }
        }
      });
    });
  },

  onPaintCanvas: function() {
    const me = this;
    const parent = me.parent;
    const parentEl = parent && parent.el;
    const canvas = me.getCanvas();
    me.setPoints([]);
    if (parentEl && canvas) {
      const parentWidth = parentEl.getWidth();
      const parentHeight = parentEl.getHeight();
      canvas.width = parentWidth;
      canvas.height = parentHeight;
      me.setContext(canvas.getContext('2d'));
      parent.on('resize', me.onResizeParent, me);
    }
  },

  onTouchStartCanvas: function(event) {
    const me = this;
    const context = me.getContext();
    const coords = me.getMouseCoords(event);
    if (context && coords) {
      context.lineWidth = me.getLineWidth();
      context.lineJoin = me.getLineJoin();
      context.lineCap = me.getLineCap();
      context.strokeStyle = me.getStrokeStyle();
      context.moveTo(coords.x, coords.y);
      context.beginPath();
      me.pointSet = [
        [coords.x, coords.y]
      ];
    }
  },

  onTouchEndCanvas: function(event) {
    const me = this;
    const coords = me.getMouseCoords(event);
    if (coords) {
      me.pointSet.push([coords.x, coords.y]);
      me.getPoints().push({
        points: me.pointSet,
        size: 3,
        color: me.getStrokeStyle()
      });
    }
  },

  onDragCanvas: function(event) {
    const context = this.getContext();
    const coords = this.getMouseCoords(event);
    if (context && coords) {
      context.lineTo(coords.x, coords.y);
      context.stroke();
      this.pointSet.push([coords.x, coords.y]);
    }
  },

  onResizeParent: function() {
    this.redrawAll();
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
  }
});