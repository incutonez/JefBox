Ext.define('JefBox.view.auth.LoginView', {
  extend: 'JefBox.BaseDialog',
  alias: 'widget.loginView',

  viewModel: {
    data: {
      userProfile: null
    },
    formulas: {
      isViewValid: function(get) {
        return get('userProfile.valid');
      }
    }
  },

  title: 'Log In',
  minimizable: false,
  maximizable: false,
  closable: false,
  maximized: true,
  defaultListenerScope: true,
  layout: {
    type: 'vbox'
  },
  bbar: {
    layout: {
      type: 'hbox',
      pack: 'end'
    },
    items: [{
      xtype: 'button',
      text: 'GO!',
      bind: {
        disabled: '{!isViewValid}'
      },
      handler: function() {
        let viewModel = this.lookupViewModel();
        let userProfile = viewModel && viewModel.get('userProfile');
        if (userProfile) {
          userProfile.logInUser();
        }
      }
    }]
  },
  items: [{
    xtype: 'textfield',
    required: true,
    label: 'User Name',
    bind: {
      value: '{userProfile.UserName}'
    },
    listeners: {
      keydown: 'onKeyDownField'
    }
  }, {
    xtype: 'textfield',
    required: true,
    inputType: 'password',
    label: 'Password',
    bind: {
      value: '{userProfile.Password}'
    },
    listeners: {
      keydown: 'onKeyDownField'
    }
  }],

  onKeyDownField: function(field, event, eOpts) {
    if (event.getKey() === event.ENTER) {
      let viewModel = this.getViewModel();
      let userProfile = viewModel && viewModel.get('userProfile');
      if (userProfile && viewModel.get('isViewValid')) {
        userProfile.logInUser();
      }
    }
  }
});