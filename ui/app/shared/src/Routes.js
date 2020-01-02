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
  }],

  constructor: function(config) {
    this.callParent(arguments);
    var paths = this.paths;
    for (var i = 0; i < paths.length; i++) {
      this.buildPath(paths[i], this.basePath);
    }
  },

  buildPath: function(path, parentPath) {
    if (path) {
      var paths = path.paths;
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
  }
});