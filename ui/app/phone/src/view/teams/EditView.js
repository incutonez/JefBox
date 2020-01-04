Ext.define('JefBox.phone.view.teams.EditView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.phoneTeamsEditView',

  isCrudDialog: true,
  layout: 'fit',
  height: '100%',
  width: '100%',
  items: [{
    xtype: 'tabpanel',
    tabBar: {
      layout: {
        pack: 'start'
      }
    },
    items: [{
      title: 'Info',
      layout: {
        type: 'vbox'
      },
      items: [{
        xtype: 'textfield',
        required: true,
        label: 'Name',
        margin: '0 20 0 0',
        bind: {
          value: '{viewRecord.Name}'
        }
      }, {
        xtype: 'textfield',
        label: 'Hex',
        margin: '0 10 0 0',
        inputMask: '#hhhhhh',
        bind: {
          value: '{viewRecord.Color}'
        }
      }, {
        xtype: 'textfield',
        required: true,
        label: 'Color',
        inputType: 'color',
        bind: {
          value: '{viewRecord.Color}'
        }
      }]
    }, {
      title: 'Users'
    }]
  }]
});