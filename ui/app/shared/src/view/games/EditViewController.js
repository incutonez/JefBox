Ext.define('JefBox.view.games.EditViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.gamesEditView',
  requires: [
    'JefBox.view.games.RoundItemView'
  ],

  showQuestionView: function(record) {
    let questionsStore = this.getRoundItemsStore();
    let lastRecord = questionsStore && questionsStore.last();
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
    let questionsStore = this.getRoundItemsStore();
    if (questionsStore) {
      let previousRound = 0;
      let previousOrder = 0;
      questionsStore.each(function(record) {
        let currentRound = record.get('Round');
        if (previousRound !== currentRound) {
          previousOrder = 1;
          previousRound = currentRound;
        }
        record.set('Order', previousOrder++);
      });
    }
  },

  onClickSaveQuestionBtn: function(questionRecord) {
    let questionsStore = this.getRoundItemsStore();
    if (questionsStore && questionRecord && !questionRecord.store) {
      questionsStore.add(questionRecord);
    }
    this.reorderQuestionsStore();
  },

  onDropQuestionRecord: function(node, data, overModel, dropPosition, eOpts) {
    let me = this;
    let record = data.records[0];
    let questionsStore = me.getRoundItemsStore();
    if (record && overModel && questionsStore) {
      // Need to insert before if we're dropping it before
      let sign = dropPosition === 'before' ? -1 : 0;
      record.set({
        Round: overModel.get('Round'),
        Order: overModel.get('Order') + sign
      });
      questionsStore.insert(record.get('Order'), record);
    }
    me.reorderQuestionsStore();
  },

  onClickAddTeam: function(gridEditor, context) {
    let viewRecord = this.getViewRecord();
    let teamsStore = viewRecord && viewRecord.getTeamsStore();
    let teamsView = this.lookup('teamsView');
    let teamsPlugin = teamsView && teamsView.getPlugin('rowEditingPlugin');
    if (teamsStore && teamsPlugin) {
      let team = teamsStore.add({});
      teamsPlugin.startEdit(team[0]);
    }
  },

  onEditQuestionRow: function(grid, info) {
    this.showQuestionView(info.record);
  },

  onDeleteQuestionRow: function(grid, info) {
    let record = info.record;
    let store = record && record.store;
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
    let me = this;
    let viewRecord = me.getViewRecord();
    if (viewRecord) {
      viewRecord.save({
        callback: function(record, operation, successful) {
          me.closeView();
        }
      });
    }
  },

  getViewRecord: function() {
    let viewModel = this.getViewModel();
    let viewRecord = viewModel && viewModel.get('viewRecord');
    if (!viewRecord) {
      this.logError('viewRecord is undefined');
    }
    return viewRecord;
  },

  getRoundItemsStore: function() {
    let viewRecord = this.getViewRecord();
    return viewRecord && viewRecord.getRoundItemsStore();
  }
});