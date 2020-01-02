/* Series of events starts the app loading... first, we grab all of our enums, and once they're loaded, we check the
 * user's session... if not logged in, show login page, otherwise, continue to loading the rest of the app */
JefBox.Enums.loadEnums(function() {
  Ext.checkingInitialAuth = true;
  JefBox.model.User.checkSession(function() {
    Ext.checkingInitialAuth = false;
    Ext.Loader.loadScript({
      url: `app/${Ext.manifest.profile}/viewport.js`,
      onLoad: function() {
        /* Finally, after we've loaded the "viewport," which contains our actual UI code, start the Application, so
         * the viewport's main view can be added... we do all of this deferring so routing has a chance to take place */
        Ext.application({
          extend: 'JefBox.shared.Application',
          name: 'JefBox',
          config: {
            quickTips: true
          }
        });
      }
    });
  });
});
