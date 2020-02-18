Ext.define('JefBox.view.games.HostViewModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.gamesHostView',

  data: {
    showAnswer: 0,
    timeRemaining: 0,
    currentQuestion: null,
    viewRecord: {
      loading: true
    }
  },

  formulas: {
    isFirstQuestion: function(get) {
      return get('currentQuestion.Id') === get('viewRecord.FirstRoundItemId');
    },
    isLastQuestion: function(get) {
      return get('currentQuestion.Id') === get('viewRecord.LastRoundItemId');
    },
    timeRemainingFm: function(get) {
      const timeRemaining = get('timeRemaining');
      if (timeRemaining === 0) {
        return 'TIME OVER!';
      }
      return `Remaining: ${Ext.util.Format.minutesSeconds(timeRemaining)}`;
    },
    timerIconCls: function(get) {
      const timerState = get('timeRemaining') % 3;
      if (timerState === 0) {
        return Icons.TIMER_END;
      }
      else if (timerState === 1) {
        return Icons.TIMER_MIDDLE;
      }
      return Icons.TIMER_START;
    },
    loadingMask: function(get) {
      return get('viewRecord.loading') ? {
        message: 'Loading...'
      } : false;
    },
    entityTextSingular: function(get) {
      return get('viewRecord.AllowTeams') ? 'Team' : 'User';
    },
    entityText: function(get) {
      return get('entityTextSingular') + 's';
    },
    allAnswersSubmitted: function(get) {
      return get('answersStore.count') === get('viewRecord.Teams.count');
    },
    // Don't show the Answers column until all Answers have been submitted
    hideAnswersColumn: function(get) {
      return !get('allAnswersSubmitted') || get('currentQuestion.Type') === Enums.RoundItemTypes.DRAWING;
    },
    isAudio: function(get) {
      return get('currentQuestion.Type') === Enums.RoundItemTypes.AUDIO;
    },
    isUploadType: function(get) {
      return get('currentQuestion.Type') === Enums.RoundItemTypes.DRAWING;
    },
    isImageVideo: function(get) {
      const types = Enums.RoundItemTypes;
      return Ext.Array.contains([types.IMAGE, types.VIDEO], get('currentQuestion.Type'));
    }
  },

  stores: {
    scoreStore: {
      model: 'JefBox.model.game.Score',
      autoLoad: true,
      groupField: 'GroupName',
      proxy: {
        type: 'ajax',
        url: 'api/games/{viewRecord.Id}/score'
      }
    },
    answersStore: {
      model: 'JefBox.model.game.RoundItemAnswer',
      proxy: {
        type: 'ajax',
        url: 'api/games/{viewRecord.Id}/currentRound',
        extraParams: {
          answersOnly: true
        }
      },
      processGroups: function(groupsStore) {
        if (groupsStore) {
          this.each(function(answerRecord) {
            const groupRecord = groupsStore.findRecord('Id', answerRecord.get('GroupId'), 0, false, true, true);
            if (groupRecord) {
              answerRecord.set('GroupName', groupRecord.get('Name'));
            }
          });
        }
      }
    },
    usersStore: {
      type: 'chained',
      source: '{viewRecord.Users}'
    },
    teamsStore: {
      type: 'chained',
      source: '{viewRecord.Teams}'
    },
    multipleAnswersStore: {
      type: 'chained',
      source: '{currentQuestion.Choices}',
      filters: [{
        property: 'IsAnswer',
        value: true
      }]
    }
  }
});