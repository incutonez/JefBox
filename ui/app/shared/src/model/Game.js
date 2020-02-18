Ext.define('JefBox.model.Game', {
  extend: 'JefBox.model.BaseGame',
  requires: [
    'JefBox.model.Team',
    'JefBox.model.game.RoundItem',
    'JefBox.view.games.EditRoundView'
  ],

  hasMany: [{
    model: 'JefBox.model.Team',
    associationKey: 'Teams',
    role: 'Teams',
    getterName: 'getTeamsStore',
    storeConfig: {
      remoteSort: false,
      remoteFilter: false,
      proxy: {
        type: 'memory'
      }
    }
  }, {
    model: 'JefBox.model.User',
    associationKey: 'Users',
    role: 'Users',
    getterName: 'getUsersStore',
    storeConfig: {
      remoteSort: false,
      remoteFilter: false,
      proxy: {
        type: 'memory'
      }
    }
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
  },

  removeTeam: function(groupId, cb) {
    const me = this;
    Ext.Ajax.request({
      method: 'DELETE',
      url: Routes.parseRoute(Schemas.Games.GROUP_UI, {
        Id: me.getId(),
        GroupId: groupId
      }),
      callback: function(options, successful, response) {
        Ext.callback(cb, me, [successful, response]);
      }
    });
  },

  deleteAnswer: function(answerId, cb) {
    const me = this;
    Ext.Ajax.request({
      method: 'DELETE',
      url: Routes.parseRoute(Schemas.Games.ANSWERS_ID_UI, {
        Id: me.getId(),
        AnswerId: answerId
      }),
      callback: function(options, successful, response) {
        Ext.callback(cb, me, [successful, response]);
      }
    });
  },

  submitEmptyRoundAnswers: function(roundId, cb) {
    const me = this;
    Ext.Ajax.request({
      method: 'PUT',
      url: Routes.parseRoute(Schemas.Games.ROUND_ITEM_ANSWERS_UI, {
        Id: me.getId(),
        RoundItemId: roundId
      }),
      callback: function(options, successful, response) {
        Ext.callback(cb, me, [successful, response]);
      }
    });
  }
});