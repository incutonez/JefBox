Ext.define('JefBox.Routes', {
  singleton: true,
  alternateClassName: [
    'Routes'
  ],
  mixins: [
    'Ext.route.Mixin'
  ],

  basePath: '',
  paths: [{
    /**
     * @property HOME
     */
    key: 'HOME',
    basePath: 'home'
  }, {
    /**
     * @property USERS
     */
    key: 'USERS',
    basePath: 'users'
  }, {
    /**
     * @property TEAMS
     */
    key: 'TEAMS',
    basePath: 'teams'
  }, {
    /**
     * @property GAMES
     */
    key: 'GAMES',
    basePath: 'games'
  }, {
    /**
     * @property UPLOADS
     */
    key: 'UPLOADS',
    basePath: 'uploads'
  }, {
    /**
     * @property PAINTER
     */
    key: 'PAINTER',
    basePath: 'painter'
  }],

  constructor: function(config) {
    this.callParent(arguments);
    const paths = this.paths;
    for (let i = 0; i < paths.length; i++) {
      this.buildPath(paths[i], this.basePath);
    }
  },

  buildPath: function(path, parentPath) {
    if (path) {
      const paths = path.paths;
      if (parentPath) {
        parentPath += '/';
      }
      parentPath += path.basePath;
      this[path.key] = parentPath;
      if (paths) {
        this.buildPath(paths, parentPath);
      }
    }
  },

  redirectToHome: function() {
    this.redirectTo(this.HOME);
  },

  parseRoute: function(routeUrl, config) {
    let route = Ext.route.Router.routes[routeUrl];
    if (!route) {
      route = Ext.create('Ext.route.Route', {
        url: routeUrl
      });
    }
    let routeKeys = routeUrl.match(route.typeParamRegex);
    let keys = Ext.Object.getKeys(route.paramsInMatchString);
    if (route.mode === 'positional') {
      routeKeys = route.paramsInMatchString;
      keys = routeKeys.map(function(item) {
        return item.replace(':', '');
      });
    }
    const record = config.record || config;
    const optionalParams = routeUrl.match(route.optionalGroupRegex);
    for (let i = 0; i < routeKeys.length; i++) {
      let found = false;
      let value = record[keys[i]];
      if (record.isModel) {
        value = record.get(keys[i]);
      }
      if (!Ext.isEmpty(optionalParams)) {
        for (let j = 0; j < optionalParams.length; j++) {
          found = optionalParams[j].indexOf(routeKeys[i]) !== -1;
          if (found) {
            Ext.Array.removeAt(optionalParams, j);
            break;
          }
        }
      }
      if (found) {
        routeUrl = routeUrl.replace(/\((.+?)\)/, Ext.isEmpty(value) ? '' : '/' + value);
      }
      else {
        routeUrl = routeUrl.replace(routeKeys[i], value);
      }
    }
    return routeUrl;
  }
});