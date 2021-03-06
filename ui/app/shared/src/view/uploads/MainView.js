Ext.define('JefBox.view.uploads.MainView', {
  extend: 'JefBox.view.BaseCrudView',
  alias: 'widget.uploadsMainView',
  requires: [
    'JefBox.view.uploads.MainViewController'
  ],

  controller: {
    type: 'uploadsMainView'
  },
  viewModel: {
    data: {
      entityName: 'Upload'
    },
    stores: {
      mainStore: JefBox.store.Uploads
    }
  },
  itemConfig: {
    viewModel: {
      formulas: {
        hideViewIcon: function(get) {
          return false;
        }
      }
    }
  },

  getPluginsConfig: Ext.emptyFn,

  getActionsColumnConfig: function() {
    return {
      view: true,
      delete: true
    };
  },

  getColumnsConfig: function() {
    const config = [];
    const actionsColumnConfig = this.getActionsColumnItems();
    if (actionsColumnConfig) {
      config.push(actionsColumnConfig);
    }
    config.push({
      text: 'Type',
      dataIndex: 'MimeType'
    }, {
      text: 'File Name',
      dataIndex: 'FileName',
      flex: 1
    }, {
      text: 'Created',
      dataIndex: 'CreateDate',
      formatter: 'dateMonthDayYearHourMinuteSecond',
      width: 175,
      cell: {
        encodeHtml: false
      }
    }, {
      text: 'Uploaded By',
      dataIndex: 'ownerDisplay'
    });
    return config;
  }
});