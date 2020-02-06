Ext.define('JefBox.model.Game', {
  extend: 'JefBox.model.BaseGame',
  requires: [
    'JefBox.model.Team',
    'JefBox.model.game.RoundItem',
    'JefBox.model.game.Score',
    'JefBox.view.games.EditRoundView'
  ],

  hasMany: [{
    model: 'JefBox.model.Team',
    associationKey: 'Teams',
    role: 'Teams',
    getterName: 'getTeamsStore'
  }, {
    model: 'JefBox.model.User',
    associationKey: 'Users',
    role: 'Users',
    getterName: 'getUsersStore'
  }, {
    model: 'JefBox.model.game.RoundItem',
    associationKey: 'RoundItems',
    role: 'RoundItems',
    getterName: 'getRoundItemsStore',
    transform: false,
    inverse: {
      getterName: 'getGameRecord'
    },
    storeConfig: {
      remoteSort: false,
      remoteFilter: false,
      proxy: {
        type: 'memory'
      },
      grouper: {
        property: 'Round',
        sortProperty: 'RoundIndex'
      },
      sorters: [{
        property: 'Order',
        direction: 'ASC'
      }]
    }
  }, {
    model: 'JefBox.model.game.Score',
    associationKey: 'Score',
    role: 'Score',
    getterName: 'getScoreStore',
    inverse: {
      getterName: 'getGameRecord'
    },
    storeConfig: {
      remoteSort: false,
      remoteFilter: false,
      groupField: 'GroupName'
    }
  }],

  proxy: {
    type: 'rest',
    url: Schemas.Games.BASE_PATH,
    writer: {
      type: 'associationWriter',
      writeAllFields: true,
      allDataOptions: {
        associated: {
          RoundItems: {
            Choices: true
          }
        },
        critical: true
      },
      partialDataOptions: {
        associated: true,
        critical: true
      }
    }
  },

  connectSocket: function(config) {
    const me = this;
    config = config || {};
    sockets.on('updatedGames' + me.getId(), function() {
      Ext.callback(config.before, config.scope);
      me.load({
        callback: function(record, options, successful) {
          Ext.callback(config.after, config.scope);
        }
      });
    });
  },

  editRoundGroup: function(group) {
    const me = this;
    const questionsStore = me.getRoundItemsStore();
    const groups = questionsStore && questionsStore.getGroups();
    if (groups && group) {
      const originalIndex = groups.indexOf(group);
      Ext.create('JefBox.view.games.EditRoundView', {
        viewModel: {
          data: {
            groupName: group.getGroupKey(),
            groupIndex: originalIndex
          }
        },
        listeners: {
          updateGroup: function(groupName, groupIndex) {
            // Need to increment by 1 of whatever user enters, so we ensure it comes after the proper index
            if (originalIndex < groupIndex) {
              groupIndex++;
            }
            // Need to decrement by 1 of whatever user enters, so we ensure it comes before the proper index
            else if (originalIndex > groupIndex) {
              groupIndex--;
            }
            group.suspendEvents();
            group.each(function(record) {
              record.set({
                Round: groupName,
                RoundIndex: groupIndex
              });
            });
            group.resumeEvents();
            // Trigger a sort, so our groupings update appropriately
            questionsStore.sort();
            me.reIndexGroups();
          }
        }
      });
    }
  },

  reIndexGroups: function() {
    const questionsStore = this.getRoundItemsStore();
    const groups = questionsStore && questionsStore.getGroups();
    if (groups) {
      /* We need to re-run through the store and set the proper index values... this is in case the user sets a
       * higher number that's basically out of bounds */
      groups.each(function(group, roundIndex) {
        group.suspendEvents();
        group.each(function(record, order) {
          record.set({
            RoundIndex: roundIndex,
            Order: order + 1
          });
          record.commit();
        });
        group.resumeEvents();
      });
      // Trigger a sort, so our groupings update appropriately
      questionsStore.sort();
    }
  }
});