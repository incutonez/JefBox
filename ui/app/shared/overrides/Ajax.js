Ext.define('JefBox.overrides.Ajax', {
  override: 'Ext.data.request.Ajax',

  createResponse: function(xhr) {
    var me = this;
    // TODOJEF: Something odd here... xhr.responseType is an empty string, even though Node is returning application/json
    let response = this.callParent(arguments);
    response.getResponseData = function() {
      return response.responseJson || Ext.decode(response.responseText, true);
    };
    response.getActionText = function(config) {
      return me.getActionText(config);
    };
    response.getToastMsg = function(config) {
      return me.getToastMsg(config);
    };
    return response;
  },

  /**
   * @param {Object} config
   * @param {String} config.actionType
   * @param {String} config.entityType
   * @return {String}
   */
  getToastMsg: function(config) {
    config = config || {};
    let entityType = config.entityType || 'record';
    let actionText = this.getActionText(config);
    if (actionText) {
      if (this.success) {
        return `Successfully ${actionText.past} ${entityType}.`;
      }
      return `Failed ${actionText.future} ${entityType}.`;
    }
  },

  /**
   * @param {Object} actionConfig
   * @param {String} actionConfig.actionType
   * @return {Object} config
   * @return {String} config.past
   * @return {String} config.present
   * @return {String} config.future
   */
  getActionText: function(actionConfig) {
    actionConfig = actionConfig || {};
    let actionType = actionConfig.actionType || this.method;
    actionType = actionType && actionType.toLowerCase();
    let config;
    switch (actionType) {
      case 'get':
        config = {
          past: 'read',
          present: 'read',
          future: 'reading'
        };
        break;
      case 'post':
        config = {
          past: 'created',
          present: 'create',
          future: 'creating'
        };
        break;
      case 'put':
        config = {
          past: 'updated',
          present: 'update',
          future: 'updating'
        };
        break;
      case 'delete':
        config = {
          past: 'deleted',
          present: 'delete',
          future: 'deleting'
        };
        break;
      case 'revert':
        config = {
          past: 'reverted',
          present: 'revert',
          future: 'reverting'
        };
        break;
    }
    return config;
  }
});