Ext.define('JefBox.view.games.HostViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.gamesHostView',

  onMarkQuestionAnsweredRow: function(grid, info) {
    let gameRecord = this.getViewRecord();
    let record = info.record;
    if (record && gameRecord) {
      record.set('AnswerDate', new Date());
      gameRecord.save();
    }
  },

  onMarkQuestionUnansweredRow: function(grid, info) {
    let gameRecord = this.getViewRecord();
    let record = info.record;
    if (record && gameRecord) {
      record.set('AnswerDate', null);
      gameRecord.save();
    }
  }
});