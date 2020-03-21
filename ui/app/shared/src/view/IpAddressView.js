Ext.define('JefBox.view.IpAddressView', {
  extend: 'Ext.Panel',
  alias: 'widget.ipAddressView',

  viewModel: {
    data: {
      ip: ''
    }
  },

  layout: {
    type: 'hbox',
    align: 'middle',
    pack: 'center'
  },

  items: [{
    xtype: 'component',
    style: 'font-size: 100px;',
    bind: {
      html: '{ip}'
    }
  }],

  initialize: function() {
    const viewModel = this.getViewModel();
    Ext.Ajax.request({
      method: 'GET',
      url: 'api/ip',
      callback: function(options, successful, response) {
        const responseData = response.getResponseData();
        if (successful && responseData && viewModel) {
          let ip = responseData.ip;
          const port = responseData.port;
          if (port !== 80) {
            ip = `${ip}:${port}`;
          }
          viewModel.set('ip', ip);
        }
      }
    });
  }
});