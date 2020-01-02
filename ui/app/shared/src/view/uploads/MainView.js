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
        viewIconCls: function(get) {
          return Icons.VIEW;
        }
      }
    }
  },

  selectable: {
    cells: true,
    rows: false
  },

  getPluginsConfig: Ext.emptyFn,

  getActionsColumnConfig: function() {
    return {
      view: true,
      delete: true
    };
  },

  getColumnsConfig: function() {
    let config = [];
    let actionsColumnConfig = this.getActionsColumnItems();
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
      text: 'File',
      dataIndex: 'Data',
      flex: 1,
      cell: {
        encodeHtml: false,
        bind: {
          value: '{record.displayValue}'
        }
      }
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