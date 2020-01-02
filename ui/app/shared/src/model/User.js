Ext.define('JefBox.model.User', {
  extend: 'JefBox.model.Crud',
  requires: [
    'JefBox.AssociationWriter',
    'JefBox.view.auth.LoginView'
  ],

  fields: [{
    name: 'UserName',
    type: 'string',
    validators: [{
      type: 'presence'
    }]
  }, {
    name: 'IsActive',
    type: 'boolean',
    persist: false
  }, {
    name: 'AccessLevel',
    type: 'int'
  }, {
    // Used only on creating a user
    name: 'Password',
    type: 'string',
    persist: false,
    validators: [{
      type: 'presence'
    }]
  }, {
    name: 'IsAdmin',
    type: 'boolean',
    persist: false
  }, {
    name: 'CanEdit',
    type: 'boolean',
    depends: ['Id'],
    convert: function(value, record) {
      if (window.UserProfile) {
        value = UserProfile.get('IsAdmin') || record.get('Id') === UserProfile.getId();
      }
      return value;
    }
  }, {
    name: 'accessLevelDisplay',
    type: 'string',
    persist: false,
    depends: ['AccessLevel'],
    convert: function(value, record) {
      return Enums.AccessLevels && Enums.AccessLevels.getDisplayValue(record.get('AccessLevel'));
    }
  }],

  hasMany: [{
    model: 'JefBox.model.Team',
    associationKey: 'Teams',
    getterName: 'getTeamsStore',
    role: 'Teams'
  }],

  proxy: {
    type: 'rest',
    url: 'api/users',
    writer: {
      type: 'associationWriter',
      writeAllFields: true,
      allDataOptions: {
        associated: true
      }
    }
  },

  statics: {
    checkSession: function(callback) {
      let me = this;
      Ext.Ajax.request({
        method: 'GET',
        url: 'api/login',
        callback: function(options, successful, response) {
          if (successful) {
            me.updateUserProfile(response.getResponseData());
            if (Ext.isFunction(callback)) {
              callback(successful);
            }
          }
          else if (!me.authWindow) {
            me.showLogInView({
              callback: callback
            });
          }
        }
      });
    },

    showLogInView: function(config) {
      let me = this;
      config = config || {};
      if (!me.authWindow) {
        me.authWindow = Ext.create('JefBox.view.auth.LoginView', {
          viewModel: {
            data: {
              userProfile: me.loadData()
            }
          },
          listeners: {
            destroy: function() {
              me.authWindow = null;
              if (config.token) {
                Routes.redirectTo(config.token, {
                  force: true
                });
              }
              if (Ext.isFunction(config.callback)) {
                config.callback(true);
              }
            }
          }
        });
      }
    },

    updateUserProfile: function(data) {
      window.UserProfile = this.loadData(data);
    }
  },

  logInUser: function(callback) {
    let me = this;
    Ext.Ajax.request({
      method: 'POST',
      url: 'api/login',
      jsonData: {
        UserName: me.get('UserName'),
        Password: me.get('Password')
      },
      callback: function(options, successful, response) {
        if (successful) {
          JefBox.model.User.updateUserProfile(response.getResponseData());
          JefBox.model.User.authWindow.close();
        }
        else {
          Ext.toast('Incorrect credentials.');
        }
      }
    });
  }
});