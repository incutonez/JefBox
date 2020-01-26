Ext.define('JefBox.view.games.EditViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.gamesEditView',
  requires: [
    'JefBox.view.games.RoundItemView'
  ],

  constructor: function(config) {
    const routes = {};
    routes[Schemas.Games.BASE_PATH_ID_UI] = {
      action: 'onRouteGameView',
      lazy: true
    };
    routes['games/new'] = {
      action: 'onRouteNewGameView',
      lazy: true
    };
    config.routes = routes;
    this.callParent(arguments);
  },

  onRouteGameView: function(params) {
    this.loadViewRecord(params.Id);
  },

  onRouteNewGameView: function(params) {
    this.processViewRecord(JefBox.model.Game.loadData());
  },

  processViewRecord: function(record) {
    const viewModel = this.getViewModel();
    if (viewModel) {
      viewModel.set('viewRecord', record);
      viewModel.notify();
    }
  },

  loadViewRecord: function(gameId) {
    const me = this;
    me.setViewLoading(true);
    JefBox.model.Game.load(gameId, {
      callback: function(record, operation, successful) {
        if (successful) {
          me.processViewRecord(record);
        }
        me.setViewLoading(false);
      }
    });
  },

  showQuestionView: function(record) {
    const questionsStore = this.getRoundItemsStore();
    const lastRecord = questionsStore && questionsStore.last();
    if (questionsStore) {
      Ext.create('JefBox.view.games.RoundItemView', {
        viewModel: {
          data: {
            viewRecord: record || JefBox.model.game.RoundItem.loadData({
              Order: lastRecord && lastRecord.get('Order') + 1 || 1,
              Round: lastRecord && lastRecord.get('Round') || 1
            })
          }
        },
        listeners: {
          scope: this,
          clickSave: 'onClickSaveQuestionBtn'
        }
      });
    }
  },

  reorderQuestionsStore: function() {
    const questionsStore = this.getRoundItemsStore();
    if (questionsStore) {
      let previousRound = 0;
      let previousOrder = 0;
      questionsStore.each(function(record) {
        const currentRound = record.get('Round');
        if (previousRound !== currentRound) {
          previousOrder = 1;
          previousRound = currentRound;
        }
        record.set('Order', previousOrder++);
      });
    }
  },

  onClickEditRoundOrder: function(grid, info) {
    const group = info.group.data;
    const questionsStore = this.getRoundItemsStore();
    const groups = questionsStore && questionsStore.getGroups();
    const roundsGrid = this.lookup('roundsGrid');
    if (group && groups && roundsGrid) {
      Ext.Msg.prompt('Change Order', 'Current Order', function(buttonId, value) {
        if (buttonId === 'ok') {
          // We want to go 1 more, so we know this comes after the next item
          value = value + 1;
          group.each(function(record) {
            record.set('RoundIndex', value);
          });
          // Trigger a sort, so our groupings update appropriately
          questionsStore.sort();
          /* We need to re-run through the store and set the proper index values... this is in case the user sets a
           * higher number that's basically out of bounds */
          groups.each(function(g) {
            const roundIndex = groups.indexOf(g);
            g.each(function(record) {
              record.set('RoundIndex', roundIndex);
            });
          });
        }
      }, null, false, String(groups.indexOf(group)), {
        xtype: 'numberfield'
      });
    }
  },

  onClickSaveQuestionBtn: function(questionRecord) {
    const questionsStore = this.getRoundItemsStore();
    if (questionsStore && questionRecord && !questionRecord.store) {
      if (Ext.isEmpty(questionRecord.get('RoundIndex'))) {
        let roundIndex;
        const found = questionsStore.findRecord('Round', questionRecord.get('Round'), 0, false, true, true);
        if (found) {
          roundIndex = found.get('RoundIndex');
        }
        else {
          const groups = questionsStore.getGroups();
          roundIndex = groups && groups.getCount();
        }
        questionRecord.set('RoundIndex', roundIndex);
      }
      questionsStore.add(questionRecord);
    }
    this.reorderQuestionsStore();
  },

  onDropQuestionRecord: function(node, data, overModel, dropPosition, eOpts) {
    const me = this;
    const record = data.records[0];
    const questionsStore = me.getRoundItemsStore();
    if (record && overModel && questionsStore) {
      // Need to insert before if we're dropping it before
      const sign = dropPosition === 'before' ? -1 : 0;
      record.set({
        Round: overModel.get('Round'),
        Order: overModel.get('Order') + sign
      });
      questionsStore.insert(record.get('Order'), record);
    }
    me.reorderQuestionsStore();
  },

  onClickAddTeam: function(gridEditor, context) {
    const viewRecord = this.getViewRecord();
    const teamsStore = viewRecord && viewRecord.getTeamsStore();
    const teamsView = this.lookup('teamsView');
    const teamsPlugin = teamsView && teamsView.getPlugin('rowEditingPlugin');
    if (teamsStore && teamsPlugin) {
      const team = teamsStore.add({});
      teamsPlugin.startEdit(team[0]);
    }
  },

  onEditQuestionRow: function(grid, info) {
    this.showQuestionView(info.record);
  },

  onDeleteQuestionRow: function(grid, info) {
    const record = info.record;
    const store = record && record.store;
    if (store) {
      store.remove(record);
    }
  },

  onClickAddQuestionBtn: function() {
    this.showQuestionView();
  },

  onClickCancel: function() {
    this.closeView();
  },

  onClickSave: function() {
    const me = this;
    const viewRecord = me.getViewRecord();
    if (viewRecord) {
      viewRecord.save({
        callback: function(record, operation, successful) {
          me.closeView();
        }
      });
    }
  },

  getViewRecord: function() {
    const viewModel = this.getViewModel();
    const viewRecord = viewModel && viewModel.get('viewRecord');
    if (!viewRecord) {
      this.logError('viewRecord is undefined');
    }
    return viewRecord;
  },

  getRoundItemsStore: function() {
    const viewRecord = this.getViewRecord();
    return viewRecord && viewRecord.getRoundItemsStore();
  }
});